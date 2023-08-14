import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Configuration {
  backend: string;
  userBackendPath: string;
  frontendVersion: string;
  sushiMenuBackendPath: string;
  sushiMenuFrontendPath: string;
  authenticationWebServiceURI: string;
  userInfoMenuFrontendPath: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigAssetLoaderService {

  private readonly CONFIG_URL = 'assets/config/config.json';
  private config: Configuration;
  private configuration$: Observable<Configuration>;

  constructor(private http: HttpClient) {
  }

  public loadConfigurations(): any {
    if (!this.configuration$) {
      this.configuration$ = (this.http.get(this.CONFIG_URL + '?' + Date.now())
        .pipe(catchError((error: any) => {
          return observableThrowError(error);
        })) as Observable<Configuration>);
      this.configuration$.subscribe((config) => this.config = config);
    }
    return this.configuration$;
  }

  public get configuration() {
    return this.config;
  }

}

export class ConfigurationService {
}
