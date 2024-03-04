import { Injectable } from '@angular/core';
import {AlertService, CognitoService} from "../../../../shared";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private userId: string = ''
  private CLOUD_GUARD_IV: Uint8Array = new Uint8Array([
    170, 76, 229, 143, 38, 62, 88, 218, 4, 172, 169, 60
  ]);

  constructor(
    private cognitoService: CognitoService,
    private alertService: AlertService,
  ) {
    this.cognitoService.currentUserId().then(userId => {
      this.userId = userId;
    });
  }

  async encrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    const key = await this.getKey();
    return await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: this.CLOUD_GUARD_IV,
      },
      key,
      data
    );
  }

  async decrypt(encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
    try {
      const key = await this.getKey();
      return await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: this.CLOUD_GUARD_IV,
        },
        key,
        encryptedData
      );
    } catch (e) {
      this.alertService.error('Data decryption error occurred. You probably need to provide the correct key.');
      return encryptedData;
    }
  }

  async encryptName(name: string): Promise<string> {
    const key = await this.getKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(name);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: this.CLOUD_GUARD_IV,
      },
      key,
      data
    );
    return this.arrayBufferToBase64(encryptedData, true);
  }

  async decryptName(encryptedName: string): Promise<string> {
    try {
      const key = await this.getKey();
      const encryptedData = this.base64ToArrayBuffer(encryptedName, true);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: this.CLOUD_GUARD_IV,
        },
        key,
        encryptedData
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);

    } catch (e) {
      this.alertService.error('Data decryption error occurred. You probably need to provide the correct key.');
      return encryptedName;
    }
  }

  async encryptUrl(url: string): Promise<string> {
    let urlPart = url.split('/');
    for (let i = 0; i < urlPart.length; i++) {
      urlPart[i] = urlPart[i] !== '' ? await this.encryptName(urlPart[i]) : '';
    }
    return urlPart.join('/');
  }

  async decryptUrl(url: string): Promise<string> {
    let urlPart = url.split('/');
    for (let i = 0; i < urlPart.length; i++) {
      urlPart[i] = urlPart[i] !== '' ? await this.decryptName(urlPart[i]) : '';
    }
    return urlPart.join('/');
  }

  async getKey(): Promise<CryptoKey> {
    try {
      const keyString = localStorage.getItem(this.getLocalstorageKey());

      if (!keyString) {
        throw new Error('Key not found in localStorage');
      }

      const keyArray = this.hexStringToArrayBuffer(keyString);
      return await this.importKey(keyArray);

    } catch (e) {
      console.log('Get key error: ', e);
      throw e;
    }
  }

  async generateKey(): Promise<void> {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const keyArray = new Uint8Array(exportedKey);
    const keyString = this.arrayBufferToHexString(keyArray);

    localStorage.setItem(this.getLocalstorageKey(), keyString);

    const blob = new Blob([keyString], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'Key.CloudGuard';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  async selectKeyFromFile(file: File): Promise<void> {
    const reader = new FileReader();

    return new Promise<void>((resolve, reject) => {
      reader.onload = async (event) => {
        const contents = event?.target?.result as string;
        localStorage.setItem(this.getLocalstorageKey(), contents);
        resolve();
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    });
  }

  async blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert Blob to ArrayBuffer'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading Blob as ArrayBuffer'));
      };

      reader.readAsArrayBuffer(blob);
    });
  }

  arrayBufferToBlob(arrayBuffer: ArrayBuffer, mimeType: string): Blob {
    return new Blob([arrayBuffer], { type: mimeType });
  }

  base64ToArrayBuffer(base64: string, urlSafe: boolean = false): ArrayBuffer {
    if (urlSafe) {
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    }
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  arrayBufferToBase64(arrayBuffer: ArrayBuffer, urlSafe: boolean = false): string {
    const bytes = new Uint8Array(arrayBuffer);
    let binaryString = '';

    for (let i = 0; i < bytes.byteLength; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    let base64 = btoa(binaryString);

    if (urlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
    }
    return base64;
  }

  public isKeySet(): boolean {
    const key = localStorage.getItem(this.getLocalstorageKey());
    return key !== null;
  }

  public removeLocalstorageKey() {
    localStorage.removeItem(this.getLocalstorageKey());
  }

  private getLocalstorageKey(): string {
    return this.userId + '.CloudGuardKey';
  }

  private async importKey(keyArray: Uint8Array): Promise<CryptoKey> {
    try {
      return await window.crypto.subtle.importKey(
        'raw',
        keyArray,
        {name: 'AES-GCM'},
        true,
        ['encrypt', 'decrypt']
      );
    } catch (e) {
      console.log('Import key error: ', e);
      throw e;
    }
  }

  private arrayBufferToHexString(buffer: Uint8Array): string {
    return Array.prototype.map.call(buffer, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }

  private hexStringToArrayBuffer(hexString: string): Uint8Array {
    const buffer = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      buffer[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }
    return buffer;
  }
}
