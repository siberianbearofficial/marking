import {Component, OnDestroy, OnInit} from '@angular/core';
import {RedirectService} from "../../../infrastructure/adapters/services/redirect.service";
import {AuthenticationService} from "../../../core/usecases/interactors/authentication.service";
import {catchError, Observable, of, Subscription, switchMap} from "rxjs";
import {mainPageUrl, signInPageUrl} from "../../../app.module";
import {RecordService} from "../../../core/usecases/interactors/record.service";
import {Record} from "../../../core/domain/entities/record";
import {Quadrilateral} from "../../../core/domain/entities/quadrilateral";

const NO_QUADRILATERAL_ERROR: Error = new Error('Не удалось обнаружить баркод и логотип на фото. Попробуйте загрузить другую фотографию.');
const NO_SCORE_ERROR: Error = new Error('Не удалось определить процент совпадения фото с эталонной маркировкой.');
const NO_BARCODE_QUADRILATERAL_WARNING: Error = new Error('Не удалось обнаружить баркод. При обработке будет учитываться только логотип.');
const NO_LOGO_QUADRILATERAL_WARNING: Error = new Error('Не удалось обнаружить логотип. При обработке будет учитываться только баркод.');

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styles: [``]
})
export class AddPageComponent implements OnInit, OnDestroy {

  private isSignedInSubscription!: Subscription;
  private postRecordSubscription!: Subscription;
  private putRecordSubscription!: Subscription;
  private redirectSubscription!: Subscription;

  public record?: Record;

  public idealImage?: HTMLImageElement;
  public photoImage?: HTMLImageElement;

  private idealBlob?: Blob;
  private photoBlob?: Blob;

  public error: string = '';
  public warning: string = '';
  public step?: number;
  public submitButtonClass?: string;
  public submitButtonText?: string;
  public headingText: string = '';
  public barcodeScoreSpanClass: string = 'd-none';
  public logoScoreSpanClass: string = 'd-none';

  constructor(private redirectService: RedirectService,
              private authenticationService: AuthenticationService,
              private recordService: RecordService) {
  }

  public ngOnInit(): void {
    this.isSignedInSubscription = this.authenticationService.isSignedIn()
      .pipe(
        catchError(() => {
          return of(false);
        }),
        switchMap((isSignedIn: boolean): Observable<boolean> => {
          return this.redirectService.redirectIf(!isSignedIn, signInPageUrl);
        })
      )
      .subscribe((redirected: boolean): void => {
        if (!redirected)
          this.setUploadImagesLayout();
      });
  }

  public onSubmit() {
    switch (this.step) {
      case 0: {
        this.postRecord();
        break;
      }
      case 1: {
        this.putRecord();
        break;
      }
      case 2: {
        this.redirectToMain();
        break;
      }
    }
  }

  private postRecord(): void {
    if (this.idealBlob && this.photoBlob) {
      this.postRecordSubscription = this.recordService.postRecord(this.idealBlob, this.photoBlob)
        .pipe(
          catchError((error) => {
            this.showError(error);
            return of(false);
          })
        )
        .subscribe((result: boolean | Record): void => {
          if (typeof result != 'boolean') {
            this.record = result;
            this.setChangeImageSelectionLayout();
          }
        });
    }
  }

  private putRecord(): void {
    if (this.record) {
      this.putRecordSubscription = this.recordService.putRecord(this.record)
        .pipe(
          catchError((error) => {
            this.showError(error);
            return of(false);
          })
        )
        .subscribe((result: boolean | Record) => {
          if (typeof result != 'boolean') {
            this.record = result;
            this.setShowComparisonResultLayout();
          }
        });
    }
  }

  private redirectToMain(): void {
    this.redirectSubscription = this.redirectService.redirect(mainPageUrl)
      .pipe(
        catchError((error) => {
          this.showError(error);
          return of(false);
        })
      )
      .subscribe();
  }

  public onPhotoBlobChange(photo: Blob): void {
    this.photoBlob = photo;
  }

  public onIdealBlobChange(ideal: Blob): void {
    this.idealBlob = ideal;
  }

  public onPhotoImageChange(photo: HTMLImageElement): void {
    this.photoImage = photo;
  }

  public onIdealImageChange(ideal: HTMLImageElement): void {
    this.idealImage = ideal;
  }

  public onBarcodeQuadrilateralChange(quadrilateral: Quadrilateral): void {
    if (this.record) {
      this.record.barcodeQuadrilateral = quadrilateral;
    }
  }

  public onLogoQuadrilateralChange(quadrilateral: Quadrilateral): void {
    if (this.record) {
      this.record.logoQuadrilateral = quadrilateral;
    }
  }

  private setUploadImagesLayout(): void {
    this.headingText = 'Выберите изображения';
    this.submitButtonClass = 'btn-dark';
    this.submitButtonText = 'Далее';

    this.step = 0;
    this.hideError();
  }

  private setChangeImageSelectionLayout(): void {
    if (this.record)
    {
      if (!this.record.barcodeQuadrilateral && !this.record.logoQuadrilateral)
        this.showError(NO_QUADRILATERAL_ERROR);
      else {
        if (!this.record.barcodeQuadrilateral && this.record.logoQuadrilateral)
          this.showWarning(NO_BARCODE_QUADRILATERAL_WARNING);
        else if (this.record.barcodeQuadrilateral && !this.record.logoQuadrilateral)
          this.showWarning(NO_LOGO_QUADRILATERAL_WARNING);

        this.headingText = 'Измените выделение';
        this.submitButtonClass = 'btn-success';
        this.submitButtonText = 'Подтвердить';

        this.step = 1;
        this.hideError();
      }
    }
  }

  private setShowComparisonResultLayout(): void {
    if (this.record && (this.record.barcodeScore || this.record.logoScore)) {
      this.barcodeScoreSpanClass = this.getScoreClass(this.record.barcodeScore);
      this.logoScoreSpanClass = this.getScoreClass(this.record.logoScore);

      this.headingText = 'Результат анализа';
      this.submitButtonClass = 'btn-primary';
      this.submitButtonText = 'Готово';

      this.step = 2;
      this.hideError();
    } else {
      this.showError(NO_SCORE_ERROR);
    }
  }

  private showError(error: Error): void {
    this.error = error.message;
  }

  private showWarning(warning: Error): void {
    this.warning = warning.message;
  }

  private hideError(): void {
    this.error = '';
  }

  public formatScore(score: number | undefined): string {
    return score ? (Math.round(score * 1000) / 10).toString() : '-';
  }

  public getScoreClass(score: number | undefined): string {
    if (score) {
      if (score * 100 < 33)
        return 'd-inline text-danger';
      if (score * 100 < 66)
        return 'd-inline text-warning';
    }
    return 'd-inline text-success';
  }

  public ngOnDestroy(): void {
    if (this.isSignedInSubscription)
      this.isSignedInSubscription.unsubscribe();
    if (this.postRecordSubscription)
      this.postRecordSubscription.unsubscribe();
    if (this.putRecordSubscription)
      this.putRecordSubscription.unsubscribe();
    if (this.redirectSubscription)
      this.redirectSubscription.unsubscribe();
  }

  protected readonly NO_BARCODE_QUADRILATERAL_WARNING = NO_BARCODE_QUADRILATERAL_WARNING;
  protected readonly NO_LOGO_QUADRILATERAL_WARNING = NO_LOGO_QUADRILATERAL_WARNING;
}
