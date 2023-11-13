import {Component, Input} from '@angular/core';
import {Quadrilateral} from "../../../../core/domain/entities/quadrilateral";
import {Rectangle} from "../../../../core/domain/entities/rectangle";

@Component({
  selector: 'app-show-comparison-result',
  templateUrl: './show-comparison-result.component.html',
  styles: [``]
})
export class ShowComparisonResultComponent {

  @Input() barcodeQuadrilateral?: Quadrilateral;
  @Input() logoQuadrilateral?: Quadrilateral;
  @Input() rectangles?: Rectangle[];
  @Input() photoImage?: HTMLImageElement;
  @Input() idealImage?: HTMLImageElement;

}
