import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {SignInRequestModel} from '../models/sign-in-request-model';

const BASE_API_URL: string = '/api';
const SIGN_IN_URL: string = 'sign-in';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationApiService {

  static INCORRECT_PASSWORD_ERROR: Error = new Error('Неверный пароль');
  static NETWORK_ERROR: Error = new Error('Ошибка, проверьте интернет соединение');
  static USER_NOT_FOUND_ERROR: Error = new Error('Пользователь не найден');
  static UNKNOWN_ERROR: Error = new Error('Неизвестная ошибка');
  static INTERNAL_SERVER_ERROR: Error = new Error('Внутренняя ошибка сервера');

  constructor(private http: HttpClient) {
  }

  public signIn(signInRequestModel: SignInRequestModel) {
    return this.http.post(`${BASE_API_URL}/${SIGN_IN_URL}`, signInRequestModel)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(AuthenticationApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(AuthenticationApiService.INCORRECT_PASSWORD_ERROR);
          }
          case 404: {
            return throwError(AuthenticationApiService.USER_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(AuthenticationApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(AuthenticationApiService.UNKNOWN_ERROR);
          }
        }
      }));
  }
}
