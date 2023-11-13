import {Injectable} from '@angular/core';
import {AuthenticationApiService} from '../../api/authentication-api.service';
import {Observable, switchMap} from 'rxjs';
import {SignInResponseModel} from "../../models/sign-in-response-model";
import {SignInRequestModel} from "../../models/sign-in-request-model";
import {SessionService} from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationAdapterService {

  constructor(private authenticationApi: AuthenticationApiService,
              private sessionService: SessionService) {
  }

  public signIn(username: string, password: string): Observable<void> {
    const signInRequestModel: SignInRequestModel = {
      'username': username,
      'password': password,
    };
    return this.authenticationApi.signIn(signInRequestModel)
      .pipe(
        switchMap((signInResponseModel: Object | string): Observable<void> => {
          let token: string;
          let exp: number;
          let uuid: string;
          let isAdmin: boolean;
          if (typeof signInResponseModel == 'string') {
            const signInResponseParsed = JSON.parse(signInResponseModel);
            token = signInResponseParsed.access_token;
            exp = signInResponseParsed.exp;
            uuid = signInResponseParsed.sub;
            isAdmin = signInResponseParsed.is_admin;
          } else {
            token = (signInResponseModel as SignInResponseModel).access_token;
            exp = (signInResponseModel as SignInResponseModel).exp;
            uuid = (signInResponseModel as SignInResponseModel).sub;
            isAdmin = (signInResponseModel as SignInResponseModel).is_admin;
          }
          return this.sessionService.activateSession(token, exp, uuid, isAdmin);
        })
      );
  }

  public signOut(): Observable<void> {
    return this.sessionService.deactivateSession();
  }

  public isSignedIn(): Observable<boolean> {
    return this.sessionService.isSessionActive();
  }

  public isAdmin(): Observable<boolean> {
    return this.sessionService.getCurrentSessionUserIsAdmin();
  }

  public getUuid(): Observable<string> {
    return this.sessionService.getCurrentSessionUserUuid();
  }
}
