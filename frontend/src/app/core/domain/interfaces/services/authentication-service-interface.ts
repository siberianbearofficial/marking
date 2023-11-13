import {Observable} from "rxjs";

export interface AuthenticationServiceInterface {
  signIn: (username: string, password: string) => Observable<void>;
  signOut: () => Observable<void>;
  isSignedIn: () => Observable<boolean>;
  isAdmin: () => Observable<boolean>;
  getUuid: () => Observable<string>;
}
