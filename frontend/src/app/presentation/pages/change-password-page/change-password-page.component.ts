import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../core/usecases/interactors/authentication.service";
import {catchError, Observable, of, Subscription, switchMap} from "rxjs";
import {RedirectService} from "../../../infrastructure/adapters/services/redirect.service";
import {signInPageUrl} from "../../../app.module";
import {DifferentPasswordsValidator} from "../../shared/validators/different-passwords-validator";
import {UserService} from "../../../core/usecases/interactors/user.service";

const SUCCESS_MESSAGE: string = 'Пароль был успешно изменен, необходимо заново войти';
const INCORRECT_INPUT_ERROR: Error = new Error('Некорректный ввод');

const CORRECT_PASSWORD_PATTERN: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styles: [``]
})
export class ChangePasswordPageComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  public success: string = '';
  public error: string = '';

  private isSignedInSubscription!: Subscription;
  private changePasswordSubscription!: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private redirectService: RedirectService) {
    this.form = new FormGroup({
      currentPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(CORRECT_PASSWORD_PATTERN)
      ]),
      newPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(CORRECT_PASSWORD_PATTERN)
      ])
    }, DifferentPasswordsValidator);
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
      .subscribe();
  }

  private showError(error: Error): void {
    this.error = error.message;
  }

  private hideError(): void {
    this.error = '';
  }

  private showSuccess(): void {
    this.success = SUCCESS_MESSAGE;
  }

  public onSubmit(): void {
    const currentPassword = this.form.value['currentPassword'];
    const newPassword = this.form.value['newPassword'];

    if (currentPassword && newPassword) {
      this.form.disable();
      this.changePasswordSubscription = this.authenticationService.getUuid()
        .pipe(
          switchMap((uuid: string) => {
            return this.userService.changeUserPasswordByUuid(uuid, currentPassword, newPassword);
          }),
          catchError((error: Error) => {
            this.showError(error);
            this.form.enable();
            return of(false);
          }),
          switchMap((status) => {
            if (status != false)
              return this.authenticationService.signOut();
            return of(false);
          }),
          switchMap((status) => {
            if (status != false) {
              this.hideError();
              this.showSuccess();
              return this.redirectService.redirectAfterTimeout(3000, signInPageUrl);
            }
            return of(false);
          })
        )
        .subscribe();
    } else {
      this.showError(INCORRECT_INPUT_ERROR);
    }
  }

  public ngOnDestroy(): void {
    if (this.isSignedInSubscription)
      this.isSignedInSubscription.unsubscribe();
    if (this.changePasswordSubscription)
      this.changePasswordSubscription.unsubscribe();
  }
}
