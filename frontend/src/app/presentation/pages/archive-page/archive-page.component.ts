import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, Observable, of, Subscription, switchMap} from "rxjs";
import {signInPageUrl} from "../../../app.module";
import {AuthenticationService} from "../../../core/usecases/interactors/authentication.service";
import {RedirectService} from "../../../infrastructure/adapters/services/redirect.service";
import {Record} from "../../../core/domain/entities/record";
import {RecordService} from "../../../core/usecases/interactors/record.service";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {
  ImageWithFiguresModalComponent
} from "../../shared/components/image-with-figures-modal/image-with-figures-modal.component";
import {ImageService} from "../../../core/usecases/interactors/image.service";

@Component({
  selector: 'app-archive-page',
  templateUrl: './archive-page.component.html',
  styles: [``]
})
export class ArchivePageComponent implements OnInit, OnDestroy {

  private onInitApiCallsSubscription!: Subscription;
  private onRecordDeleteSubscription!: Subscription;
  private getIdealImageUrlSubscription!: Subscription;
  private getPhotoImageUrlSubscription!: Subscription;

  public records?: Record[];
  public error: string = '';

  private modalRef: MdbModalRef<ImageWithFiguresModalComponent> | null = null;

  constructor(private redirectService: RedirectService,
              private authenticationService: AuthenticationService,
              private recordService: RecordService,
              private imageService: ImageService,
              private modalService: MdbModalService) {
  }

  public ngOnInit(): void {
    this.onInitApiCallsSubscription = this.authenticationService.isSignedIn()
      .pipe(
        catchError(() => {
          return of(false);
        }),
        switchMap((isSignedIn: boolean): Observable<boolean> => {
          return this.redirectService.redirectIf(!isSignedIn, signInPageUrl);
        }),
        switchMap((isRedirectedToSignIn: boolean) => {
          if (!isRedirectedToSignIn)
            return this.recordService.getRecords();
          return of(false);
        }),
        catchError((error) => {
          this.showError(error);
          return of(false);
        }),
      )
      .subscribe((result): void => {
        if (typeof result != 'boolean') {
          this.records = result;
          this.hideError();
        }
      });
  }

  public onRecordDelete(record: Record): void {
    this.onRecordDeleteSubscription = this.recordService.deleteRecord(record)
      .pipe(
        catchError((error) => {
          this.showError(error);
          return of(false);
        }),
        switchMap((result) => {
          if (result != false)
            return this.recordService.getRecords();
          return of(false);
        }),
        catchError((error) => {
          this.showError(error);
          return of(false);
        })
      )
      .subscribe((result) => {
        if (typeof result != 'boolean') {
          this.records = result;
          this.hideError();
        }
      });
  }

  public onRecordIdealIconClick(record: Record): void {
    this.getIdealImageUrlSubscription = this.imageService.getIdealImageUrl(record.uuid)
      .pipe(
        catchError((error) => {
          this.showError(error);
          return of(false);
        })
      )
      .subscribe((result: boolean | string) => {
        if (result != false) {
          const config = {
            animation: true,
            backdrop: true,
            containerClass: 'right',
            data: {
              title: 'Эталонная маркировка',
              imageUrl: result
            },
            ignoreBackdropClick: false,
            keyboard: true,
            modalClass: 'image-with-figures-modal-top-right',
          }
          this.modalRef = this.modalService.open(ImageWithFiguresModalComponent, config);
        }
      });
  }

  public onRecordPhotoIconClick(record: Record): void {
    this.getPhotoImageUrlSubscription = this.imageService.getPhotoImageUrl(record.uuid)
      .pipe(
        catchError((error) => {
          this.showError(error);
          return of(false);
        })
      )
      .subscribe((result: boolean | string) => {
        if (result != false) {
          const config = {
            animation: true,
            backdrop: true,
            containerClass: 'right',
            data: {
              title: 'Фотография коробки',
              imageUrl: result,
              barcodeQuadrilateral: record.barcodeQuadrilateral,
              logoQuadrilateral: record.logoQuadrilateral
            },
            ignoreBackdropClick: false,
            keyboard: true,
            modalClass: 'image-with-figures-modal-top-right',
          }
          this.modalRef = this.modalService.open(ImageWithFiguresModalComponent, config);
        }
      });
  }

  private showError(error: Error): void {
    this.error = error.message;
  }

  private hideError(): void {
    this.error = '';
  }

  public ngOnDestroy(): void {
    if (this.onInitApiCallsSubscription)
      this.onInitApiCallsSubscription.unsubscribe();
    if (this.onRecordDeleteSubscription)
      this.onRecordDeleteSubscription.unsubscribe();
    if (this.getIdealImageUrlSubscription)
      this.getIdealImageUrlSubscription.unsubscribe();
    if (this.getPhotoImageUrlSubscription)
      this.getPhotoImageUrlSubscription.unsubscribe();
  }
}
