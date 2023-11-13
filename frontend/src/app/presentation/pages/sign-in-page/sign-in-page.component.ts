import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../core/usecases/interactors/authentication.service";
import {catchError, Observable, of, Subscription, switchMap} from "rxjs";
import {mainPageUrl} from '../../../app.module';
import {RedirectService} from "../../../infrastructure/adapters/services/redirect.service";

const INCORRECT_INPUT_ERROR: Error = new Error('Некорректный ввод');

const CORRECT_PASSWORD_PATTERN: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styles: [``]
})
export class SignInPageComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  public error: string = '';

  private isSignedInSubscription!: Subscription;
  private signInSubscription!: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private redirectService: RedirectService) {
    this.form = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(CORRECT_PASSWORD_PATTERN)
      ])
    });
  }

  public ngOnInit(): void {
    this.form.disable();
    this.isSignedInSubscription = this.authenticationService.isSignedIn()
      .pipe(
        catchError(() => {
          return of(false);
        }),
        switchMap((isSignedIn: boolean): Observable<boolean> => {
          return this.redirectService.redirectIf(isSignedIn, mainPageUrl);
        })
      )
      .subscribe((redirectedToMain: boolean): void => {
        if (!redirectedToMain)
          this.form.enable();
      });
  }

  public showError(error: Error): void {
    this.error = error.message;
  }

  public onSubmit(): void {
    const username = this.form.value['username'];
    const password = this.form.value['password'];

    if (username && password) {
      this.form.disable();
      this.signInSubscription = this.authenticationService.signIn(username, password)
        .pipe(
          catchError((error) => {
            this.form.enable();
            this.showError(error);
            return of(false);
          }),
          switchMap((status) => {
            return this.redirectService.redirectIf(status != false, mainPageUrl);
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
    if (this.signInSubscription)
      this.signInSubscription.unsubscribe();
  }
}
