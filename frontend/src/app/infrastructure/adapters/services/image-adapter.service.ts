import {Injectable} from '@angular/core';
import {ImageApiService} from "../../api/image-api.service";
import {map, Observable} from "rxjs";
import {ImageUrlModel} from "../../models/image-url-model";

@Injectable({
  providedIn: 'root'
})
export class ImageAdapterService {

  constructor(private imageApi: ImageApiService) {
  }

  public getIdealImageUrl(recordUuid: string): Observable<string> {
    return this.imageApi.getImageUrl(recordUuid, 'ideal')
      .pipe(
        map((imageUrlModel: Object | string): string => {
          if (typeof imageUrlModel == 'string')
            return (JSON.parse(imageUrlModel) as ImageUrlModel).image_url;
          return (imageUrlModel as ImageUrlModel).image_url;
        })
      );
  }

  public getPhotoImageUrl(recordUuid: string): Observable<string> {
    return this.imageApi.getImageUrl(recordUuid, 'photo')
      .pipe(
        map((imageUrlModel: Object | string): string => {
          if (typeof imageUrlModel == 'string')
            return (JSON.parse(imageUrlModel) as ImageUrlModel).image_url;
          return (imageUrlModel as ImageUrlModel).image_url;
        })
      );
  }
}
