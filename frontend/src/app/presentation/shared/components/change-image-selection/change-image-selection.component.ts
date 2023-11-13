import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Quadrilateral} from "../../../../core/domain/entities/quadrilateral";

@Component({
  selector: 'app-change-image-selection',
  templateUrl: './change-image-selection.component.html',
  styles: [``]
})
export class ChangeImageSelectionComponent {

  @Input() barcodeQuadrilateral?: Quadrilateral;
  @Input() logoQuadrilateral?: Quadrilateral;
  @Input() idealImage?: HTMLImageElement;
  @Input() photoImage?: HTMLImageElement;

  @Output() barcodeQuadrilateralEvent: EventEmitter<Quadrilateral> = new EventEmitter<Quadrilateral>();
  @Output() logoQuadrilateralEvent: EventEmitter<Quadrilateral> = new EventEmitter<Quadrilateral>();

  public onBarcodeQuadrilateralChange(quadrilateral: Quadrilateral): void {
    this.barcodeQuadrilateralEvent.emit(quadrilateral);
  }

  public onLogoQuadrilateralChange(quadrilateral: Quadrilateral): void {
    this.logoQuadrilateralEvent.emit(quadrilateral);
  }
}
