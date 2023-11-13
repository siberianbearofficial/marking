import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

const BASE_API_URL: string = '/api';
const IMAGES_URL: string = 'images';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService {

  static NETWORK_ERROR: Error = new Error('Ошибка, проверьте интернет соединение');
  static IMAGE_NOT_FOUND_ERROR: Error = new Error('Изображение не найдено');
  static IMAGE_FORBIDDEN_ERROR: Error = new Error('К этому изображению нет доступа');
  static SESSION_EXPIRED_ERROR: Error = new Error('Сессия устарела, необходимо войти заново');
  static UNKNOWN_ERROR: Error = new Error('Неизвестная ошибка');
  static INTERNAL_SERVER_ERROR: Error = new Error('Внутренняя ошибка сервера');

  constructor(private http: HttpClient) {
  }

  public getImageUrl(uuid: string, name: string) {
    return this.http.get(`${BASE_API_URL}/${IMAGES_URL}/${uuid}/${name}`)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(ImageApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(ImageApiService.SESSION_EXPIRED_ERROR);
          }
          case 403: {
            return throwError(ImageApiService.IMAGE_FORBIDDEN_ERROR);
          }
          case 404: {
            return throwError(ImageApiService.IMAGE_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(ImageApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(ImageApiService.UNKNOWN_ERROR);
          }
        }
      }));
  }
}
