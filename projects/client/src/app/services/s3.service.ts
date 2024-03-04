import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import * as JSZip from "jszip";
import { StatusCodes } from 'http-status-codes';
import { AlertService, CognitoService } from "../global-shared";
import { environment } from "../../../../../src/environments/environment";
import { FileManagerType, FileNode } from "@types";
import { CryptoService } from "@app/services/crypto.service";


@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private url: string = environment.serverUrl;
  private accessToken: string = '';
  private _loading: boolean = false;

  constructor(
    private cognitoService: CognitoService,
    private http: HttpClient,
    private alertService: AlertService,
    private cryptoService: CryptoService
  ) {
    this.cognitoService.getAccessToken().then((accessToken) => {
      this.accessToken = accessToken ?? '';
    });
  }

  get loading(): boolean {
    return this._loading;
  }

  async getObjects(type: FileManagerType): Promise<FileNode[]> {
    const objects = await this.fetch('get', `s3/bucket/${type}/objects`) as FileNode[];

    if (type === FileManagerType.PersonalVault && objects.length > 0) {
      const traverse = async (obj: FileNode) => {
        if (obj.name !== '/') {
          obj.encryptedUrl = obj.url;
          obj.name = await this.cryptoService.decryptName(obj.name);
          obj.url = await this.cryptoService.decryptUrl(obj.url);
        }

        if (obj?.children) {
          const children = obj.children;
          for (let i = 0; i < children.length; i++) {
            await traverse(children[i]);
          }
        }
      }
      await traverse(objects[0]);
    }

    return objects;
  }

  async getImagePreview(type: FileManagerType, imageUrl: string): Promise<string> {
    if (type === FileManagerType.PersonalVault) {
      imageUrl = await this.cryptoService.encryptUrl(imageUrl);
    }
    const base64Image = await this.fetch('get', `s3/bucket/${type}/objectService/${imageUrl}/func/image`) as string;

    if (type === FileManagerType.PersonalVault) {
      const buffer = this.cryptoService.base64ToArrayBuffer(base64Image);
      const decrypted = await this.cryptoService.decrypt(buffer);
      return this.cryptoService.arrayBufferToBase64(decrypted);
    }
    return base64Image;
  }

  async createFolder(type: FileManagerType, folderUrl: string): Promise<FileNode[]> {
    if (type === FileManagerType.PersonalVault) {
      folderUrl = await this.cryptoService.encryptUrl(folderUrl);
    }
    return await this.fetch('put', `s3/bucket/${type}/objectService/${folderUrl}/func/createFolder`) as FileNode[];
  }

  async downloadObject(type: FileManagerType, object: FileNode): Promise<any> {
    try {
      this._loading = true;
      const response = await fetch(this.url + `api/s3/bucket/${type}/objects/${object.encryptedUrl ?? object.url}`, {
        'method' : 'GET',
        'headers' : {
          'Authorization': 'Bearer ' + this.accessToken,
          'Folder': object.isFolder ? 'true' : 'false'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file: ' + response.statusText);
      }

      const blob = await response.blob();
      let url;

      if (type === FileManagerType.PersonalVault) {
        if (!object.isFolder) {
          const buffer = await this.cryptoService.blobToArrayBuffer(blob);
          const decrypted = await this.cryptoService.decrypt(buffer);
          const mimeType = response.headers.get('Content-Type') ?? 'text/plain';
          const decryptedBlob = this.cryptoService.arrayBufferToBlob(decrypted, mimeType);
          url = URL.createObjectURL(decryptedBlob);

        } else {
          const zip = new JSZip();
          const decryptedZip = new JSZip();
          await zip.loadAsync(blob);

          await Promise.all(
            Object.entries(zip.files).map(async ([fileUrl, file]) => {
              const decryptedUrl = await this.cryptoService.decryptUrl(fileUrl);
              const data = await file.async("arraybuffer");
              const decryptedData = data.byteLength > 0 ? await this.cryptoService.decrypt(data) : data;

              decryptedZip.file(decryptedUrl, decryptedData);
            })
          );
          const decryptedBlob = await decryptedZip.generateAsync({ type: 'blob' });
          url = URL.createObjectURL(decryptedBlob);
        }
      } else {
        url = URL.createObjectURL(blob);
      }

      const a = document.createElement('a');
      a.href = url;
      a.download = object.name;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up the object URL to release resources
      URL.revokeObjectURL(url);
      this._loading = false;
      return true;

    } catch (error) {
      this._loading = false;
      this.errorHandler(error);
      return null;
    }
  }

  async deleteObject(type: FileManagerType, object: FileNode): Promise<boolean> {
    const options: any = {}

    if (object.isFolder) {
      options.body = { isFolder: true }
    }
    return await this.fetch('delete', `s3/bucket/${type}/objects/${object.encryptedUrl ?? object.url}`, options) as boolean;
  }

  async uploadObject(
    type: FileManagerType,
    fileUrl: string,
    content: ArrayBuffer,
    onStart: () => void,
    onProgress: (progressDelta: number) => void,
    onComplete: () => void,
    onError: () => void,
  ) {

    if (type === FileManagerType.PersonalVault) {
      content = await this.cryptoService.encrypt(content);
      fileUrl = await this.cryptoService.encryptUrl(fileUrl);
    }

    const CHUNK_SIZE = 10 * 1024 * 1024;   // min chunk 10 MB
    const totalChunks = content?.byteLength > 0 ? content?.byteLength / CHUNK_SIZE : 1;
    const fileUniqueUrl = Math.random().toString(36).slice(-6) + fileUrl;
    const progressDelta = 100 / totalChunks;
    const uploadedParts = []

    onStart();
    await this.createMultipartUpload(type, fileUrl);

    for (let chunk = 0; chunk < totalChunks; chunk++) {
      let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);
      const uploadedPart = await this.uploadObjectPart(type, fileUniqueUrl, CHUNK, chunk + 1);
      uploadedParts.push(uploadedPart);
      onProgress(progressDelta);
    }

    const res = await this.completeMultipartUpload(type, fileUrl, uploadedParts);
    if (res) {
      onComplete();
    } else {
      onError();
    }
  }

  private async createMultipartUpload(type: FileManagerType, fileUrl: string): Promise<boolean> {
    return await this.fetch('put', `s3/bucket/${type}/objects/${fileUrl}`) as boolean;
  }

  private async completeMultipartUpload(type: FileManagerType, fileUrl: string, uploadedParts: any): Promise<boolean> {
    return await this.fetch('post', `s3/bucket/${type}/objects/${fileUrl}`, {
      body: { uploadedParts }
    }) as boolean;
  }

  private async uploadObjectPart(type: FileManagerType, fileUrl: string, fileContent: any, partNumber: number): Promise<any> {
    try {
      this._loading = true;
      const response = await fetch(this.url + `api/s3/bucket/${type}/objects/${fileUrl}`, {
        'method' : 'PATCH',
        'headers' : {
          'content-type': "application/octet-stream",
          'content-length': fileContent.byteLength.toString(),
          'part-number': partNumber.toString(),
          'Authorization': 'Bearer ' + this.accessToken,
        },
        'body': fileContent
      });

      this._loading = false;
      return response.json();

    } catch (error) {
      this._loading = false;
      this.errorHandler(error);
      return null;
    }
  }

  private errorHandler (error: any) {
    console.error(error);

    if (error?.error?.message) {
      this.alertService.error(error.error.message);
    } else if (error?.message) {
      this.alertService.error(error.message);
    }

    if (error.status === StatusCodes.UNAUTHORIZED) {
      if (!window.location.href.startsWith(environment.authAppUrl)) {
        window.location.href = environment.authAppUrl;
      }
    }
  }

  private async fetch(method: string, endpoint: string, options: any = {}): Promise<any> {
    this._loading = true;
    endpoint = this.url + 'api/' + endpoint;
    const headers = options.headers ?? new HttpHeaders();
    options.headers = headers.set('Authorization', 'Bearer ' + this.accessToken);

    try {
      const res = await lastValueFrom(this.http.request(method, endpoint, options));
      this._loading = false;
      return res;

    } catch (error) {
      this._loading = false;
      this.errorHandler(error);
      return null;
    }
  }
}
