import {Injectable} from '@angular/core';
import * as moment from "moment/moment";
import {Observable, Subscriber} from "rxjs";

const ID_TOKEN_STORAGE_KEY: string = 'id_token';
const ID_TOKEN_EXPIRATION_STORAGE_KEY: string = 'id_token_exp';
const USER_UUID_STORAGE_KEY: string = 'user_uuid';
const USER_IS_ADMIN_STORAGE_KEY: string = 'user_is_admin';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
  }

  public activateSession(idToken: string, idTokenExpiration: number, userUuid: string, userIsAdmin: boolean): Observable<void> {
    return new Observable<void>((observer: Subscriber<void>): { unsubscribe(): void } => {
        if (idToken && idTokenExpiration && userUuid)
          this.activateSessionSync(idToken, idTokenExpiration, userUuid, userIsAdmin);
        observer.next();
        return {
          unsubscribe(): void {
          }
        };
      }
    );
  }

  public deactivateSession(): Observable<void> {
    return new Observable<void>((observer: Subscriber<void>): { unsubscribe(): void } => {
        this.deactivateSessionSync();
        observer.next();
        return {
          unsubscribe(): void {
          }
        };
      }
    );
  }

  public isSessionActive(): Observable<boolean> {
    return new Observable<boolean>((observer: Subscriber<boolean>): { unsubscribe(): void } => {
        let status: boolean = this.isSessionActiveSync();
        observer.next(status);
        return {
          unsubscribe(): void {
          }
        };
      }
    );
  }

  public getCurrentSessionUserUuid(): Observable<string> {
    return new Observable<string>((observer: Subscriber<string>): { unsubscribe(): void } => {
        const uuid: string | null = this.getUserUuid();
        observer.next(uuid ? uuid : '');
        return {
          unsubscribe(): void {
          }
        };
      }
    );
  }

  public getCurrentSessionUserIsAdmin(): Observable<boolean> {
    return new Observable<boolean>((observer: Subscriber<boolean>): { unsubscribe(): void } => {
        const isAdmin: boolean | null = this.getUserIsAdmin();
        observer.next(isAdmin ? isAdmin : false);
        return {
          unsubscribe(): void {
          }
        };
      }
    );
  }

  private activateSessionSync(idToken: string, idTokenExpiration: number, userUuid: string, userIsAdmin: boolean): void {
    const idTokenExpirationMoment: moment.Moment = moment().add(idTokenExpiration, 'second');

    localStorage.setItem(ID_TOKEN_STORAGE_KEY, idToken);
    localStorage.setItem(ID_TOKEN_EXPIRATION_STORAGE_KEY, JSON.stringify(idTokenExpirationMoment.valueOf()));
    localStorage.setItem(USER_UUID_STORAGE_KEY, userUuid);
    localStorage.setItem(USER_IS_ADMIN_STORAGE_KEY, JSON.stringify(userIsAdmin));
  }

  private deactivateSessionSync(): void {
    localStorage.removeItem(ID_TOKEN_STORAGE_KEY);
    localStorage.removeItem(ID_TOKEN_EXPIRATION_STORAGE_KEY);
    localStorage.removeItem(USER_UUID_STORAGE_KEY);
    localStorage.removeItem(USER_IS_ADMIN_STORAGE_KEY);
  }

  private isSessionActiveSync(): boolean {
    const idToken: string | null = localStorage.getItem(ID_TOKEN_STORAGE_KEY);
    const idTokenExpiration: moment.Moment | null = this.getIdTokenExpiration();
    if (idToken && idTokenExpiration)
      return moment().isBefore(idTokenExpiration);
    return false;
  }

  private getIdTokenExpiration(): moment.Moment | null {
    const idTokenExpiration: string | null = localStorage.getItem(ID_TOKEN_EXPIRATION_STORAGE_KEY);
    if (idTokenExpiration)
      return moment(JSON.parse(idTokenExpiration));
    return null;
  }

  private getUserUuid(): string | null {
    return localStorage.getItem(USER_UUID_STORAGE_KEY);
  }

  private getUserIsAdmin(): boolean | null {
    const userIsAdmin: string | null = localStorage.getItem(USER_IS_ADMIN_STORAGE_KEY);
    if (userIsAdmin)
      return JSON.parse(userIsAdmin);
    return null;
  }
}
