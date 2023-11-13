import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input, OnDestroy,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import {Quadrilateral} from "../../../../core/domain/entities/quadrilateral";
import {Rectangle} from "../../../../core/domain/entities/rectangle";
import {CoordinatesService} from "../../../../infrastructure/adapters/services/coordinates.service";

const IMAGE_CONTAINER_ID: string = 'imageContainer';

@Component({
  selector: 'app-image-with-figures',
  templateUrl: './image-with-figures.component.html',
  styles: [`
    .barcode .line {
      stroke-width: 3px;
      stroke: green;
    }

    .logo .line {
      stroke-width: 3px;
      stroke: cornflowerblue;
    }

    .rectangle .line {
      stroke-width: 3px;
      stroke: crimson;
    }
  `]
})
export class ImageWithFiguresComponent implements AfterViewInit, AfterContentChecked, OnDestroy {

  @ViewChildren(IMAGE_CONTAINER_ID, {read: ElementRef}) imageContainerQueryList?: QueryList<ElementRef>;

  @Input() image?: HTMLImageElement;
  @Input() rectangles?: Rectangle[];
  @Input() barcodeQuadrilateral?: Quadrilateral;
  @Input() logoQuadrilateral?: Quadrilateral;

  public relativeBarcodeQuadrilateral?: Quadrilateral;
  public relativeLogoQuadrilateral?: Quadrilateral;
  public relativeRectangles?: Rectangle[];

  private imageOriginalWidth?: number;

  constructor(private renderer: Renderer2,
              private coordinates: CoordinatesService) {
  }

  public ngAfterViewInit(): void {
    if (this.image && this.imageContainerQueryList?.first) {

      this.imageOriginalWidth = this.image.width;

      this.image.setAttribute('width', '100%');
      this.renderer.appendChild(this.imageContainerQueryList.first.nativeElement, this.image);


      if (this.imageOriginalWidth)
        this.coordinates.setupSystem(0, 0, this.image.width / this.imageOriginalWidth);

      Promise.resolve(null).then((): void => {
        this.afterInit();
      });
    }
  }

  public afterInit(): void {
    this.calculateWeight();
    this.calculateRelativeQuadrilaterals();
    this.calculateRelativeRectangles();
  }

  public ngAfterContentChecked(): void {
    this.afterInit();
  }

  public ngOnDestroy(): void {
    if (this.image)
      this.image.removeAttribute('width');
  }

  private calculateRelativeQuadrilaterals(): void {
    if (this.barcodeQuadrilateral)
      this.relativeBarcodeQuadrilateral = this.coordinates.originalToSystemQuadrilateral(this.barcodeQuadrilateral);
    if (this.logoQuadrilateral)
      this.relativeLogoQuadrilateral = this.coordinates.originalToSystemQuadrilateral(this.logoQuadrilateral);
  }

  private calculateRelativeRectangles(): void {
    if (this.rectangles) {
      this.relativeRectangles = [];
      this.rectangles.forEach((rectangle: Rectangle) => {
        this.relativeRectangles?.push(this.coordinates.originalToSystemRectangle(rectangle));
      });
    }
  }

  private calculateWeight(): void {
    if (this.image && this.imageOriginalWidth)
      this.coordinates.setWeight(this.image.width / this.imageOriginalWidth);
  }
}
