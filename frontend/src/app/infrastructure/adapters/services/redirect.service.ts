import {Injectable} from '@angular/core';
import {delay, from, Observable, of, retry, switchMap} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router: Router) {
  }

  public redirect(redirectUrl: string): Observable<boolean> {
    return from(this.router.navigateByUrl('/' + redirectUrl))
      .pipe(
        retry(3)
      );
  }

  public redirectIf(condition: boolean, redirectUrl: string): Observable<boolean> {
    if (condition)
      return this.redirect(redirectUrl);
    return of(false);
  }

  public redirectAfterTimeout(timeout: number, redirectUrl: string): Observable<boolean> {
    return of(true).pipe(
      delay(timeout),
      switchMap(() => {
        return this.redirect(redirectUrl);
      })
    );
  }
}
