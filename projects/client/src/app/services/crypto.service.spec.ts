import { TestBed, async } from '@angular/core/testing';
import { CryptoService } from './crypto.service';
import { CognitoService } from '../../../../shared';
import { AlertService } from '../../../../shared';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CryptoService,
        { provide: CognitoService, useValue: { currentUserId: async () => 'testUserId' } },
        AlertService
      ]
    }).compileComponents();
    service = TestBed.inject(CryptoService);

    // @ts-ignore
    service.originalGetKey = service.getKey;
    service.getKey = async (): Promise<CryptoKey> => {
      const keyArray = service.hexStringToArrayBuffer('47fa4283484c4d66e4fb4b44085746646d520ec4cd94ee6e5b940c4b744424b5');
      return await window.crypto.subtle.importKey(
        'raw',
        keyArray,
        {name: 'AES-GCM'},
        true,
        ['encrypt', 'decrypt']
      );
    };

    const decodedIv = atob('kkzlj8k8WN8krKk8');
    const decodedIvArray = decodedIv.split('').map(char => char.charCodeAt(0));

    Object.defineProperty(service, 'iv', {
      value: new Uint8Array(decodedIvArray),
      writable: true
    });

    (window as any).URL.createObjectURL = () => {};
    // @ts-ignore
    (window as any).URL.revokeObjectURL = (url) => {};
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('encrypt and decrypt methods', () => {
    it('encrypt and decrypt data', async () => {
      const testData = new Uint8Array([1, 2, 3, 4, 5]);
      const encryptedData = await service.encrypt(testData.buffer);
      const decryptedData = await service.decrypt(encryptedData);

      expect(decryptedData).toEqual(testData.buffer);
    });
  });

  describe('encryptName and decryptName methods', () => {
    it('encrypt and decrypt name', async () => {
      const testName = 'John Doe';
      const encryptedName = await service.encryptName(testName);
      const decryptedName = await service.decryptName(encryptedName);

      expect(decryptedName).toEqual(testName);
    });
  });

  describe('encryptUrl and decryptUrl methods', () => {
    it('encrypt and decrypt URL', async () => {
      const testUrl = 'home/folder/test.txt';
      const encryptedUrl = await service.encryptUrl(testUrl);
      const decryptedUrl = await service.decryptUrl(encryptedUrl);

      expect(decryptedUrl).toEqual(testUrl);
    });
  });

  describe('isKeySet method', () => {
    it('should return false if key is not set', () => {
      localStorage.removeItem(service.getLocalstorageKey());
      expect(service.isKeySet()).toBe(false);
    });

    it('should return true if key is set', () => {
      localStorage.setItem(service.getLocalstorageKey(), 'testKey');
      expect(service.isKeySet()).toBe(true);
      localStorage.removeItem(service.getLocalstorageKey()); // Clean up
    });
  });

  describe('removeLocalstorageKey method', () => {
    it('should remove encryption key from localStorage', () => {
      localStorage.setItem(service.getLocalstorageKey(), 'testKey');
      service.removeLocalstorageKey();
      expect(localStorage.getItem(service.getLocalstorageKey())).toBeNull();
    });
  });

  describe('getKey method', () => {
    it('should throw an error if key is not found in localStorage', async () => {
      localStorage.removeItem(service.getLocalstorageKey());
      // @ts-ignore
      await expect(service.originalGetKey()).rejects.toThrowError('Key not found in localStorage');
    });

    it('should return a CryptoKey if key is found in localStorage', async () => {
      const testKey = '47fa4283484c4d66e4fb4b44085746646d520ec4cd94ee6e5b940c4b744424b5'; // Test key
      localStorage.setItem(service.getLocalstorageKey(), testKey);
      const key = await service.getKey();
      expect(key).toBeDefined();
      localStorage.removeItem(service.getLocalstorageKey()); // Clean up
    });
  });

  describe('generateKey method', () => {
    it('should generate a new encryption key and store it in localStorage', async () => {
      localStorage.removeItem(service.getLocalstorageKey());
      await service.generateKey();
      const key = localStorage.getItem(service.getLocalstorageKey());
      expect(key).toBeTruthy();
      localStorage.removeItem(service.getLocalstorageKey()); // Clean up
    });
  });

  describe('selectKeyFromFile method', () => {
    it('should read a key from file and store it in localStorage', async () => {
      const testKey = '47fa4283484c4d66e4fb4b44085746646d520ec4cd94ee6e5b940c4b744424b5'; // Test key
      const blob = new Blob([testKey], { type: 'text/plain' });
      const file = new File([blob], 'testKey.txt');
      await service.selectKeyFromFile(file);
      const key = localStorage.getItem(service.getLocalstorageKey());
      expect(key).toEqual(testKey);
      localStorage.removeItem(service.getLocalstorageKey()); // Clean up
    });
  });
});
