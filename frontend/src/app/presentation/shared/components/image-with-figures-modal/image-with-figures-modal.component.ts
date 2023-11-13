import {AfterContentInit, Component} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {Quadrilateral} from "../../../../core/domain/entities/quadrilateral";
import {Rectangle} from "../../../../core/domain/entities/rectangle";

@Component({
  selector: 'app-image-with-figures-modal',
  templateUrl: './image-with-figures-modal.component.html',
  styles: [``]
})
export class ImageWithFiguresModalComponent implements AfterContentInit {

  public title?: string;
  public imageUrl?: string;
  public image?: HTMLImageElement;
  public barcodeQuadrilateral?: Quadrilateral;
  public logoQuadrilateral?: Quadrilateral;
  public rectangles?: Rectangle[];

  public loaded: boolean = false;

  constructor(public modalRef: MdbModalRef<ImageWithFiguresModalComponent>) {
  }

  public ngAfterContentInit(): void {
    if (this.imageUrl) {
      this.image = new Image();
      this.image.src = this.imageUrl;
      this.image.onload = () => {
        this.loaded = true;
      }
    }
  }
}
