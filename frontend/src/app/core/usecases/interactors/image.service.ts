import {Injectable} from '@angular/core';
import {ImageServiceInterface} from "../../domain/interfaces/services/image-service-interface";
import {Observable} from "rxjs";
import {ImageAdapterService} from "../../../infrastructure/adapters/services/image-adapter.service";

@Injectable({
  providedIn: 'root'
})
export class ImageService implements ImageServiceInterface {

  constructor(private imageAdapter: ImageAdapterService) {
  }

  public getIdealImageUrl(recordUuid: string): Observable<string> {
    return this.imageAdapter.getIdealImageUrl(recordUuid);
  }

  public getPhotoImageUrl(recordUuid: string): Observable<string> {
    return this.imageAdapter.getPhotoImageUrl(recordUuid);
  }
}
