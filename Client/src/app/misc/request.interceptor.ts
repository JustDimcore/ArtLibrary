import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {tap} from 'rxjs/internal/operators';
import {Router} from '@angular/router';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private _router: Router) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {}, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(['login']);
          }
        }
      })
    );
  }
}
