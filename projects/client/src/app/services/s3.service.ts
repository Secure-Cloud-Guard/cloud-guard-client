import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { StatusCodes } from 'http-status-codes';
import { AlertService, CognitoService } from "../global-shared";
import { environment } from "../../../../../src/environments/environment";
import { FileManagerType, FileNode } from "@types";


@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private url: string = environment.serverUrl;
  private accessToken: string = '';

  constructor(
    private cognitoService: CognitoService,
    private http: HttpClient,
    private alertService: AlertService,
  ) {
    this.cognitoService.getAccessToken().then((accessToken) => {
      this.accessToken = accessToken ?? '';
    });
  }

  async getObjects(type: FileManagerType): Promise<FileNode[]> {
    return await this.fetch('get', `s3/bucket/${type}/objects`) as FileNode[];
  }

  async getImagePreview(type: FileManagerType, imageName: string): Promise<string> {
    return await this.fetch('get', `s3/bucket/${type}/objectService/${imageName}/func/image`) as string;
  }

  async createFolder(type: FileManagerType, folderUrl: string): Promise<FileNode[]> {
    return await this.fetch('put', `s3/bucket/${type}/objectService/${folderUrl}/func/createFolder`) as FileNode[];
  }

  async downloadObject(type: FileManagerType, objectUrl: string, isFolder: boolean): Promise<any> {
    try {
      const response = await fetch(this.url + `api/s3/bucket/${type}/objects/${objectUrl}`, {
        'method' : 'GET',
        'headers' : {
          'Authorization': 'Bearer ' + this.accessToken,
          'Folder': isFolder ? 'true' : 'false'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file: ' + response.statusText);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = isFolder
        ? objectUrl.slice(0, -1).split('/').pop() as string
        : objectUrl.split('/').pop() as string;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up the object URL to release resources
      URL.revokeObjectURL(url);
      return true;

    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }

  async deleteObject(type: FileManagerType, objectUrl: string, isFolder: boolean): Promise<boolean> {
    const options: any = {}
    if (isFolder) {
      options.body = { isFolder }
    }
    return await this.fetch('delete', `s3/bucket/${type}/objects/${objectUrl}`, options) as boolean;
  }

  async createMultipartUpload(type: FileManagerType, fileUrl: string): Promise<boolean> {
    return await this.fetch('put', `s3/bucket/${type}/objects/${fileUrl}`) as boolean;
  }

  async completeMultipartUpload(type: FileManagerType, fileUrl: string, uploadedParts: any): Promise<boolean> {
    return await this.fetch('post', `s3/bucket/${type}/objects/${fileUrl}`, {
      body: { uploadedParts }
    }) as boolean;
  }

  async uploadObjectPart(type: FileManagerType, fileUrl: string, fileContent: any, partNumber: number): Promise<any> {
    try {
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
      return response.json();

    } catch (error) {
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
    endpoint = this.url + 'api/' + endpoint;
    const headers = options.headers ?? new HttpHeaders();
    options.headers = headers.set('Authorization', 'Bearer ' + this.accessToken);

    try {
      return await lastValueFrom(this.http.request(method, endpoint, options));
    } catch (error) {
      this.errorHandler(error);
      return null;
    }
  }
}
