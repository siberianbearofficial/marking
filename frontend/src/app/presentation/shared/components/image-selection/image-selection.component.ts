import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import {Quadrilateral} from "../../../../core/domain/entities/quadrilateral";
import {Point} from "../../../../core/domain/entities/point";
import {CoordinatesService} from "../../../../infrastructure/adapters/services/coordinates.service";

const IMAGE_CONTAINER_ID: string = 'imageContainer';

@Component({
  selector: 'app-image-selection',
  templateUrl: './image-selection.component.html',
  styles: [`
    .barcode .line {
      stroke-width: 3px;
      stroke: green;
    }

    .logo .line {
      stroke-width: 3px;
      stroke: cornflowerblue;
    }
  `]
})
export class ImageSelectionComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {

  @ViewChildren(IMAGE_CONTAINER_ID, {read: ElementRef}) imageContainerQueryList?: QueryList<ElementRef>;

  @Input() barcodeQuadrilateral?: Quadrilateral;
  @Input() logoQuadrilateral?: Quadrilateral;
  @Input() image?: HTMLImageElement;

  @Output() barcodeQuadrilateralEvent: EventEmitter<Quadrilateral> = new EventEmitter<Quadrilateral>();
  @Output() logoQuadrilateralEvent: EventEmitter<Quadrilateral> = new EventEmitter<Quadrilateral>();

  public relativeBarcodeQuadrilateral?: Quadrilateral;
  public relativeLogoQuadrilateral?: Quadrilateral;
  public initialBarcodeQuadrilateral?: Quadrilateral;
  public initialLogoQuadrilateral?: Quadrilateral;

  private imageOriginalWidth?: number;

  constructor(private renderer: Renderer2,
              private coordinates: CoordinatesService) {
  }

  public ngOnInit(): void {
    this.calculateRelativeQuadrilaterals();
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
    this.calculateInitialQuadrilaterals();
    this.calculateRelativeQuadrilaterals();
  }

  public ngAfterContentChecked(): void {
    this.calculateWeight();
    this.calculateRelativeQuadrilaterals();
  }

  public onBarcodeQuadrilateralCornerDrag(corner: string, relativePoint: Point): void {
    this.calculateWeight();
    if (this.barcodeQuadrilateral && corner in this.barcodeQuadrilateral)
      this.barcodeQuadrilateral[corner as keyof Quadrilateral] = this.coordinates.systemToOriginalPoint(relativePoint);
  }

  public onLogoQuadrilateralCornerDrag(corner: string, relativePoint: Point): void {
    this.calculateWeight();
    if (this.logoQuadrilateral && corner in this.logoQuadrilateral)
      this.logoQuadrilateral[corner as keyof Quadrilateral] = this.coordinates.systemToOriginalPoint(relativePoint);
  }

  public onDragEnd(): void {
    if (this.barcodeQuadrilateral && this.logoQuadrilateral) {
      this.barcodeQuadrilateralEvent.emit(this.barcodeQuadrilateral);
      this.logoQuadrilateralEvent.emit(this.logoQuadrilateral);
    }
  }

  public ngOnDestroy(): void {
    if (this.image)
      this.image.removeAttribute('width');
  }

  private calculateInitialQuadrilaterals(): void {
    if (this.barcodeQuadrilateral)
      this.initialBarcodeQuadrilateral = this.coordinates.originalToSystemQuadrilateral(this.barcodeQuadrilateral);
    if (this.logoQuadrilateral)
      this.initialLogoQuadrilateral = this.coordinates.originalToSystemQuadrilateral(this.logoQuadrilateral);
  }

  private calculateRelativeQuadrilaterals(): void {
    if (this.barcodeQuadrilateral)
      this.relativeBarcodeQuadrilateral = this.coordinates.originalToSystemQuadrilateral(this.barcodeQuadrilateral);
    if (this.logoQuadrilateral)
      this.relativeLogoQuadrilateral = this.coordinates.originalToSystemQuadrilateral(this.logoQuadrilateral);
  }

  private calculateWeight(): void {
    if (this.image && this.imageOriginalWidth)
      this.coordinates.setWeight(this.image.width / this.imageOriginalWidth);
  }
}
