import { Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorSnackbarComponent} from '../widgets/error-snackbar/error-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackbar: MatSnackBar
  ) { }

  openSnackbar(message: string, duration: number, action?: string): void {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }

  openSnackbarFromComponent(message: string, duration: number) {
    this.snackbar.openFromComponent(ErrorSnackbarComponent, {
      data: message,
      duration: duration
    });
  }
}
