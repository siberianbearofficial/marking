import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RecordModel} from "../models/record-model";
import {catchError, Observable, throwError} from "rxjs";

const BASE_API_URL: string = '/api';
const RECORDS_URL: string = 'records';

@Injectable({
  providedIn: 'root'
})
export class RecordApiService {

  static NETWORK_ERROR: Error = new Error('Ошибка, проверьте интернет соединение');
  static RECORD_NOT_FOUND_ERROR: Error = new Error('Запись не найдена');
  static RECORD_FORBIDDEN_ERROR: Error = new Error('К этой записи нет доступа');
  static SESSION_EXPIRED_ERROR: Error = new Error('Сессия устарела, необходимо войти заново');
  static UNKNOWN_ERROR: Error = new Error('Неизвестная ошибка');
  static INTERNAL_SERVER_ERROR: Error = new Error('Внутренняя ошибка сервера');

  constructor(private http: HttpClient) {
  }

  public getRecords() {
    return this.http.get(`${BASE_API_URL}/${RECORDS_URL}`)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(RecordApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(RecordApiService.SESSION_EXPIRED_ERROR);
          }
          case 500: {
            return throwError(RecordApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(RecordApiService.UNKNOWN_ERROR);
          }
        }
      }));
  }

  public postRecord(postRecordRequestModel: FormData) {
    return this.http.post(`${BASE_API_URL}/${RECORDS_URL}`, postRecordRequestModel)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(RecordApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(RecordApiService.SESSION_EXPIRED_ERROR);
          }
          case 500: {
            return throwError(RecordApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(RecordApiService.UNKNOWN_ERROR);
          }
        }
      }));
  }

  public putRecord(recordUuid: string, recordModel: RecordModel) {
    return this.http.put(`${BASE_API_URL}/${RECORDS_URL}`, recordModel)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(RecordApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(RecordApiService.SESSION_EXPIRED_ERROR);
          }
          case 403: {
            return throwError(RecordApiService.RECORD_FORBIDDEN_ERROR);
          }
          case 404: {
            return throwError(RecordApiService.RECORD_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(RecordApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(RecordApiService.UNKNOWN_ERROR);
          }
        }
      }));
  }

  public deleteRecord(recordUuid: string) {
    return this.http.delete(`${BASE_API_URL}/${RECORDS_URL}/${recordUuid}`)
      .pipe(catchError((error): Observable<never> => {
        switch (error.status) {
          case 0: {
            return throwError(RecordApiService.NETWORK_ERROR);
          }
          case 401: {
            return throwError(RecordApiService.SESSION_EXPIRED_ERROR);
          }
          case 403: {
            return throwError(RecordApiService.RECORD_FORBIDDEN_ERROR);
          }
          case 404: {
            return throwError(RecordApiService.RECORD_NOT_FOUND_ERROR);
          }
          case 500: {
            return throwError(RecordApiService.INTERNAL_SERVER_ERROR);
          }
          default: {
            return throwError(RecordApiService.UNKNOWN_ERROR);
          }
        }
      }));
  }
}
