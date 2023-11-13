import {Injectable} from '@angular/core';
import {Record} from "../../../core/domain/entities/record";
import {RecordModel} from "../../models/record-model";
import {RecordApiService} from "../../api/record-api.service";
import {map, Observable} from "rxjs";
import {Quadrilateral} from "../../../core/domain/entities/quadrilateral";

@Injectable({
  providedIn: 'root'
})
export class RecordAdapterService {

  constructor(private recordApi: RecordApiService) {
  }

  public getRecords(): Observable<Record[]> {
    return this.recordApi.getRecords()
      .pipe(
        map((recordModelsObject: Object | string): Record[] => {
          const record_models: RecordModel[] = recordModelsObject as RecordModel[];
          let records: Record[] = [];
          record_models.forEach((recordModel: RecordModel) => {
            const record: Record = {
              uuid: recordModel.uuid,
              barcodeQuadrilateral: recordModel.quadrilateral_barcode as Quadrilateral,
              logoQuadrilateral: recordModel.quadrilateral_logo as Quadrilateral,
              approved: recordModel.approved,
              barcodeScore: recordModel.barcode_score,
              logoScore: recordModel.logo_score
            };
            records.push(record);
          });
          return records;
        })
      );
  }

  public postRecord(idealBlob: Blob, photoBlob: Blob): Observable<Record> {
    const postRecordRequestModel: FormData = RecordAdapterService.createPostRecordRequestModel(idealBlob, photoBlob);
    return this.recordApi.postRecord(postRecordRequestModel)
      .pipe(
        map((recordModelObject: Object | string): Record => {
          const recordModel: RecordModel = recordModelObject as RecordModel;
          return {
            uuid: recordModel.uuid,
            barcodeQuadrilateral: recordModel.quadrilateral_barcode as Quadrilateral,
            logoQuadrilateral: recordModel.quadrilateral_logo as Quadrilateral,
            approved: recordModel.approved,
            barcodeScore: recordModel.barcode_score,
            logoScore: recordModel.logo_score
          };
        })
      );
  }

  public putRecord(recordUuid: string, record: Record): Observable<Record> {
    const recordModel: RecordModel = {
      uuid: record.uuid,
      quadrilateral_barcode: record.barcodeQuadrilateral,
      quadrilateral_logo: record.logoQuadrilateral,
      approved: record.approved,
      barcode_score: record.barcodeScore,
      logo_score: record.logoScore
    };
    return this.recordApi.putRecord(recordUuid, recordModel)
      .pipe(
        map((recordModelObject: Object | string): Record => {
          const recordModel: RecordModel = recordModelObject as RecordModel;
          return {
            uuid: recordModel.uuid,
            barcodeQuadrilateral: recordModel.quadrilateral_barcode as Quadrilateral,
            logoQuadrilateral: recordModel.quadrilateral_logo as Quadrilateral,
            approved: recordModel.approved,
            barcodeScore: recordModel.barcode_score,
            logoScore: recordModel.logo_score
          };
        })
      );
  }

  public deleteRecord(recordUuid: string): Observable<void> {
    return this.recordApi.deleteRecord(recordUuid)
      .pipe(
        map(() => {
          return void 0;
        })
      );
  }

  private static createPostRecordRequestModel(idealBlob: Blob, photoBlob: Blob): FormData {
    const postRecordRequestModel: FormData = new FormData();
    postRecordRequestModel.append('ideal', idealBlob);
    postRecordRequestModel.append('photo', photoBlob);
    return postRecordRequestModel;
  }
}
