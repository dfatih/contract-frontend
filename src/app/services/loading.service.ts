import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSource = new BehaviorSubject(false);
  loading$ = this.loadingSource.asObservable();

  constructor() { }

  setLoading(loadingState: boolean): void {
    this.loadingSource.next(loadingState);
  }
}
