import { Injectable } from '@angular/core';
import {HalUtils} from '../hal/util/halUtils';
import {SessionService} from './session.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {empty, Observable} from 'rxjs';
import {Param} from '../model/domain/param';
import {catchError} from 'rxjs/operators';
import {Paragraph} from '../model/domain/paragraph.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public sessionService: SessionService,
    public http: HttpClient,
    public router: Router
  ) { }

  public getRequest<T>(link: string, contentToken?: string): Observable<Object> {
    let headers = new HttpHeaders();
    if (this.sessionService.getSession().token !== undefined) {
      const authheaders = this.bearerHeader();
      headers = headers.set('Authorization', authheaders);
    }
    if (contentToken) {
      headers = headers.set('content-token', contentToken);
    }
    return this.http.get(HalUtils.removeLinkTemplate(link), { headers: headers, withCredentials: true }).pipe(catchError((error, caught) => {
      return empty();
    }));
  }

  public deleteRequest<T>(link: string): Observable<Object> {
    const headers = new HttpHeaders();
    if (this.sessionService.getSession().token !== undefined) {
      const authheaders = this.bearerHeader();
      headers.append('Authorization', authheaders);
    }

    return this.http.delete(link, { headers: headers, withCredentials: true }).pipe(catchError((error, caught) => {
      return empty();
    }));
  }

  public putRequest<T>(link: string, value: T, contentToken?: string, args?: Param): Observable<Object> {
    const params = new HttpParams();
    if (args) {
      for (const arg in args) {
        params.append(arg, args[arg]);
      }
    }
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (contentToken) {
      headers = headers.set('content-token', contentToken);
    }
// headers.append('Authorization', this.bearerHeaders().get('Authorization'));

    return this.http.put(HalUtils.removeLinkTemplate(link), value, { headers: headers, params: params, withCredentials: true })
      .pipe(catchError((error, caught) => {
        return empty();
      }));

  }

  public postRequest<T>(link: string, value: T, contentToken?: string, args?: Param): Observable<Object> {
    const params = new HttpParams();
    if (args) {
      for (const arg in args) {
        params.append(arg, args[arg]);
      }
    }
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json')
    headers = headers.set('Access-Control-Allow-Origin', '*')
    headers = headers.set('Access-Control-Allow-Methods', 'POST')
    if (contentToken) {
      headers = headers.set('content-token', contentToken);
    }
// headers.append('Authorization', this.bearerHeaders().get('Authorization'));

    return this.http.post(HalUtils.removeLinkTemplate(link), value, { headers: headers, params: params, withCredentials: true })
      .pipe(catchError((error, caught) => {
        return empty();
      }));

  }

  private bearerHeader(): string {
    return 'Bearer ' + this.sessionService.getSession().token.access_token;
  }
}
