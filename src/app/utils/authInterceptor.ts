import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import {stringify} from '@angular/compiler/src/util';
import {Session} from '../model/domain/session';
import {LoadingService} from '../services/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
      private snackbarService: SnackbarService,
      private loadingService: LoadingService,
      private matDialog: MatDialog
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // if (currentUser && currentUser.token) {
    //   request = request.clone({
    //     setHeaders: {
    //       'Content-Type': 'application/json',
    //       Authorization: `JWT ${currentUser.token}`
    //     }
    //   });
    // }

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (!err.status.toString().match(/^[4-5][0-9][0-9]$/)) {
          return;
        }
        this.loadingService.setLoading(false);
        this.matDialog.closeAll();
        if (err.status.toString().match(/^5[0-9][0-9]$/)) {
          this.snackbarService
            .openSnackbarFromComponent(err.status + ': Server-Fehler', 5000);
        } else if (err.status.toString().match(/^403$/)) {
          this.snackbarService
            .openSnackbarFromComponent(err.status + ': Unzureichende Berechtigung', 5000);
        } else if (err.status.toString().match(/^400$/)) {
          this.snackbarService
            .openSnackbarFromComponent(err.status + ': Ungültige Syntax', 5000);
        } else if (err.status.toString().match(/^401$/)) {
          this.snackbarService
            .openSnackbarFromComponent(err.status + ': Unauthorisiert', 5000);
        } else if (err.status.toString().match(/^404$/)) {
            this.snackbarService
              .openSnackbarFromComponent(err.status + ': ' + err.error.toString(), 5000);
          }
        } else {
        this.snackbarService
          .openSnackbarFromComponent(err.status + ': ' + err.message, 5000);
      }
    }));
  }
}
