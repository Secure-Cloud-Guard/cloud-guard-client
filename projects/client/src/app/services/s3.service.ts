import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { StatusCodes } from 'http-status-codes';
import { CognitoService } from "../global-shared";
import { environment } from "../../../../../src/environments/environment";
import {FileManagerType, FileNode} from "@types";


@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private url: string = environment.serverUrl;
  private accessToken: string = '';

  constructor(private cognitoService: CognitoService, private http: HttpClient) {
    this.cognitoService.getAccessToken().then((accessToken) => {
      this.accessToken = accessToken ?? '';
    });
  }

  async getObjects(type: FileManagerType): Promise<FileNode[]> {
    return await this.fetch('get', `s3/bucket/${type}/objects`) as FileNode[];
  }

  async getImagePreview(type: FileManagerType, imageName: string): Promise<string> {
    return await this.fetch('get', `s3/bucket/${type}/objects/${imageName}/image`) as string;
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
  }

  private errorHandler (error: any) {
    console.error(error);

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
