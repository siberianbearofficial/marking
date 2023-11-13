import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Record} from "../../../../core/domain/entities/record";

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styles: [``]
})
export class RecordsListComponent {

  @Input() records?: Record[];
  @Output() recordDeletionEvent: EventEmitter<Record> = new EventEmitter<Record>();
  @Output() recordIdealIconClickEvent: EventEmitter<Record> = new EventEmitter<Record>();
  @Output() recordPhotoIconClickEvent: EventEmitter<Record> = new EventEmitter<Record>();

  public getScoreClass(score: number | undefined): string {
    if (score) {
      if ((score * 100) > 66)
        return 'text-success';
      else if ((score * 100) > 33)
        return 'text-warning';
      return 'text-danger';
    }
    return 'text-secondary';
  }

  public onIdealIconClick(record: Record): void {
    this.recordIdealIconClickEvent.emit(record);
  }

  public onPhotoIconClick(record: Record): void {
    this.recordPhotoIconClickEvent.emit(record);
  }

  public onRecordDelete(record: Record): void {
    this.recordDeletionEvent.emit(record);
  }
}
