import {Component} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styles: [``]
})
export class UploadImagesComponent {

  @Output() photoBlobEvent: EventEmitter<Blob> = new EventEmitter<Blob>();
  @Output() idealBlobEvent: EventEmitter<Blob> = new EventEmitter<Blob>();
  @Output() photoImageEvent: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();
  @Output() idealImageEvent: EventEmitter<HTMLImageElement> = new EventEmitter<HTMLImageElement>();

  public idealImage?: HTMLImageElement;
  public photoImage?: HTMLImageElement;

  public onIdealSelect(event: Event): void {
    if (event.target) {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const idealBlob: Blob | undefined = target.files?.[0];
      if (idealBlob)
      {
        this.idealBlobEvent.emit(idealBlob);
        this.readIdeal(idealBlob);
      }
    }
  }

  public onPhotoSelect(event: Event): void {
    if (event.target) {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const photoBlob: Blob | undefined = target.files?.[0];
      if (photoBlob)
      {
        this.photoBlobEvent.emit(photoBlob);
        this.readPhoto(photoBlob);
      }
    }
  }

  private readPhoto(photoBlob: Blob): void {
    const reader: FileReader = new FileReader();
    reader.onload = (_event: ProgressEvent<FileReader>): void => {
      if (reader.result) {
        this.photoImage = new Image();
        this.photoImage.src = reader.result as string;
        this.photoImageEvent.emit(this.photoImage);
      }
    }
    if (photoBlob)
      reader.readAsDataURL(photoBlob);
  }

  private readIdeal(idealBlob: Blob): void {
    const reader: FileReader = new FileReader();
    reader.onload = (_event: ProgressEvent<FileReader>): void => {
      if (reader.result) {
        this.idealImage = new Image();
        this.idealImage.src = reader.result as string;
        this.idealImageEvent.emit(this.idealImage);
      }
    }
    if (idealBlob)
      reader.readAsDataURL(idealBlob);
  }
}
