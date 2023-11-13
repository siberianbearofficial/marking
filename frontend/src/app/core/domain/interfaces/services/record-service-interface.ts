import {Observable} from "rxjs";
import {Record} from "../../entities/record";

export interface RecordServiceInterface {
  getRecords: () => Observable<Record[]>;
  postRecord: (idealBlob: Blob, photoBlob: Blob) => Observable<Record>;
  putRecord: (record: Record) => Observable<Record>;
  deleteRecord: (record: Record) => Observable<void>;
}
