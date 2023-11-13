import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Point} from "../../../../core/domain/entities/point";

const WIDTH: number = 10;
const HEIGHT: number = 10;

@Component({
  selector: 'app-image-selection-corner',
  template: `
    <div class="position-absolute corner"
         style="border: 3px solid {{color}}; background-color: {{bgColor}};"
         *ngIf="initialPosition"
         cdkDrag
         [cdkDragBoundary]="boundaryElement ? boundaryElement : ''"
         [cdkDragFreeDragPosition]="{x: initialPosition.x - width / 2, y: initialPosition.y - height / 2}"
         (cdkDragMoved)="onDragMove($event)"
         (cdkDragEnded)="onDragEnd()"></div>`,
  styles: [`
    .corner {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      border-radius: 50%;
      cursor: grab;
    }
  `]
})
export class ImageSelectionCornerComponent {

  @Input() boundaryElement?: HTMLElement;
  @Input() initialPosition?: Point;
  @Input() color?: string;
  @Input() bgColor?: string;

  @Output() dragMoveEvent: EventEmitter<Point> = new EventEmitter<Point>();
  @Output() dragEndEvent: EventEmitter<void> = new EventEmitter<void>();

  public width: number = WIDTH;
  public height: number = HEIGHT;

  public onDragMove(event: any): void {
    if (this.dragMoveEvent) {
      const centerPosition: Point = event.source.getFreeDragPosition();
      this.dragMoveEvent.emit({
        x: centerPosition.x + this.width / 2,
        y: centerPosition.y + this.height / 2
      });
    }
  }

  public onDragEnd(): void {
    if (this.dragEndEvent)
      this.dragEndEvent.emit();
  }
}
