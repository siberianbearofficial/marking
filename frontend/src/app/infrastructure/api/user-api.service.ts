import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ChangeUserPasswordRequestModel} from "../models/change-user-password-request-model";
import {UserModel} from "../models/user-model";
import {CreateUserRequestModel} from "../models/create-user-request-model";

const BASE_API_URL: string = '/api';
const USERS_URL: string = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  static NETWORK_ERROR: Error = new Error('Ошибка, проверьте интернет соединение');
  static USER_NOT_FOUND_ERROR: Error = new Error('Пользователь не найден');
  static USER_ALREADY_EXIST_ERROR: Error = new Error('Этот логин уже занят');
  static USER_FORBIDDEN_ERROR: Error = new Error('Нет доступа');
  static SESSION_EXPIRED_ERROR: Error = new Error('Сессия устарела, необходимо войти заново');
  static INCORRECT_PASSWORD_ERROR: Error = new Error('Неверный пароль');
  static UNKNOWN_ERROR: Error = new Error('Неизвестная ошибка');
  static INTERNAL_SERVER_ERROR: Error = new Error('Внутренняя ошибка сервера');

  constructor(private http: HttpClient) {
  }

  public getUsers() {
    return this.http.get(`${BASE_API_URL}/${USERS_URL}`)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(UserApiService.NETWORK_ERROR);
          }
          case 500: {
            return throwError(UserApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(UserApiService.UNKNOWN_ERROR)
          }
        }
      }));
  }

  public getUsersByUsername(username: string) {
    return this.http.get(`${BASE_API_URL}/${USERS_URL}`, {
      params: new HttpParams().append('username', username)
    })
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(UserApiService.NETWORK_ERROR);
          }
          case 500: {
            return throwError(UserApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(UserApiService.UNKNOWN_ERROR)
          }
        }
      }));
  }

  public getUser(uuid: string) {
    return this.http.get(`${BASE_API_URL}/${USERS_URL}/${uuid}`)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(UserApiService.NETWORK_ERROR);
          }
          case 403: {
            return throwError(UserApiService.USER_FORBIDDEN_ERROR);
          }
          case 404: {
            return throwError(UserApiService.USER_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(UserApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(UserApiService.UNKNOWN_ERROR)
          }
        }
      }));
  }

  public postUser(createUserRequestModel: CreateUserRequestModel) {
    return this.http.post(`${BASE_API_URL}/${USERS_URL}`, createUserRequestModel)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(UserApiService.NETWORK_ERROR);
          }
          case 403: {
            return throwError(UserApiService.USER_ALREADY_EXIST_ERROR);
          }
          case 500: {
            return throwError(UserApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(UserApiService.UNKNOWN_ERROR)
          }
        }
      }));
  }

  public putUser(uuid: string, userModel: UserModel) {
    return this.http.put(`${BASE_API_URL}/${USERS_URL}/${uuid}`, userModel)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(UserApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(UserApiService.SESSION_EXPIRED_ERROR);
          }
          case 403: {
            return throwError(UserApiService.USER_FORBIDDEN_ERROR);
          }
          case 404: {
            return throwError(UserApiService.USER_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(UserApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(UserApiService.UNKNOWN_ERROR)
          }
        }
      }));
  }

  public changeUserPassword(uuid: string, changePasswordRequestModel: ChangeUserPasswordRequestModel) {
    return this.http.put(`${BASE_API_URL}/${USERS_URL}/${uuid}/password`, changePasswordRequestModel)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(UserApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(UserApiService.INCORRECT_PASSWORD_ERROR);
          }
          case 403: {
            return throwError(UserApiService.USER_FORBIDDEN_ERROR);
          }
          case 404: {
            return throwError(UserApiService.USER_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(UserApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(UserApiService.UNKNOWN_ERROR)
          }
        }
      }));
  }

  public deleteUser(uuid: string) {
    return this.http.delete(`${BASE_API_URL}/${USERS_URL}/${uuid}`)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(UserApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(UserApiService.SESSION_EXPIRED_ERROR);
          }
          case 403: {
            return throwError(UserApiService.USER_FORBIDDEN_ERROR);
          }
          case 404: {
            return throwError(UserApiService.USER_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(UserApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(UserApiService.UNKNOWN_ERROR)
          }
        }
      }));
  }
}
