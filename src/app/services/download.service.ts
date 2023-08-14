import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Contract} from '../model/domain/contract.model';
import {saveAs} from 'file-saver';
import {Download, download} from '../model/domain/download';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) {
  }

  download(url: string, contentToken: string, filename: string): Observable<Download> {
    let headers = new HttpHeaders();
    headers = headers.set('content-token', contentToken);

    return this.http.get(url, {
      responseType: 'blob',
      headers: headers,
      reportProgress: true,
      observe: 'events',
      withCredentials: true
    }).pipe(download(blob => saveAs(blob, filename)));
  }
}
