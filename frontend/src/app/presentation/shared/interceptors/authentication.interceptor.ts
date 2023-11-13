import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken: string | null = localStorage.getItem("id_token");

    if (idToken) {
      const cloned: HttpRequest<any> = request.clone({
        headers: request.headers.set("Authorization",
          "Bearer " + idToken)
      });
      return next.handle(cloned);
    } else {
      const cloned: HttpRequest<any> = request.clone({
        headers: request.headers.set("Authorization",
          "Not authorized")
      });
      return next.handle(cloned);
    }
  }
}
