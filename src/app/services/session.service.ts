import { Injectable } from '@angular/core';
import {Session} from '../model/domain/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private static readonly SESSION_KEY: string = 'session';

  constructor() { }

  public startSession() {
    let session = new Session();
    sessionStorage.setItem(SessionService.SESSION_KEY, JSON.stringify(session));
  }

  public setSession(session: Session) {
    sessionStorage.setItem(SessionService.SESSION_KEY, JSON.stringify(session));
  }

  public getSession(): Session {
    return this.getCurrentSession();
  }

  public resetSession() {
    sessionStorage.removeItem(SessionService.SESSION_KEY);
  }

  private getCurrentSession(): Session {
    let sessionJson = sessionStorage.getItem(SessionService.SESSION_KEY);
    if (sessionJson != null) {
      return JSON.parse(sessionJson);
    } else return undefined;
  }
}
