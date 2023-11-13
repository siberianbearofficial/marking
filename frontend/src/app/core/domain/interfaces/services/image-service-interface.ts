import {Observable} from "rxjs";

export interface ImageServiceInterface {
  getIdealImageUrl: (recordUuid: string) => Observable<string>;
  getPhotoImageUrl: (recordUuid: string) => Observable<string>;
}
