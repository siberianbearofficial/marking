import {Injectable} from '@angular/core';
import {AuthenticationServiceInterface} from "../../domain/interfaces/services/authentication-service-interface";
import {Observable} from "rxjs";
import {AuthenticationAdapterService} from "../../../infrastructure/adapters/services/authentication-adapter.service";
import {PasswordService} from "./password.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements AuthenticationServiceInterface {

  constructor(private authenticationAdapter: AuthenticationAdapterService,
              private passwordService: PasswordService) {
  }

  public signIn(username: string, password: string): Observable<void> {
    return this.authenticationAdapter.signIn(username, this.passwordService.hash(password));
  }

  public signOut(): Observable<void> {
    return this.authenticationAdapter.signOut();
  }

  public isSignedIn(): Observable<boolean> {
    return this.authenticationAdapter.isSignedIn();
  }

  public isAdmin(): Observable<boolean> {
    return this.authenticationAdapter.isAdmin();
  }

  public getUuid(): Observable<string> {
    return this.authenticationAdapter.getUuid();
  }
}
