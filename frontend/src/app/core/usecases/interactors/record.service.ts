import {Injectable} from '@angular/core';
import {RecordServiceInterface} from "../../domain/interfaces/services/record-service-interface";
import {Observable} from "rxjs";
import {Record} from "../../domain/entities/record";
import {RecordAdapterService} from "../../../infrastructure/adapters/services/record-adapter.service";

@Injectable({
  providedIn: 'root'
})
export class RecordService implements RecordServiceInterface {

  constructor(private recordAdapter: RecordAdapterService) {
  }

  public getRecords(): Observable<Record[]> {
    return this.recordAdapter.getRecords();
  }

  public postRecord(idealBlob: Blob, photoBlob: Blob): Observable<Record> {
    return this.recordAdapter.postRecord(idealBlob, photoBlob);
  }

  public putRecord(record: Record): Observable<Record> {
    return this.recordAdapter.putRecord(record.uuid, record);
  }

  public deleteRecord(record: Record): Observable<void> {
    return this.recordAdapter.deleteRecord(record.uuid);
  }
}
