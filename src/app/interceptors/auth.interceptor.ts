import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, share, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(this.storage.one('_auth')).pipe(

      switchMap(token => {
        if (token) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}`}
          });
        }

        return next.handle(request).pipe(

          share(),

          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              token = event.headers.get('authorization');
              if (token) {
                this.storage.create('_auth', token);
              }
            }
            return event;
          }),

          catchError((errorResponse: HttpErrorResponse) => {
            const { status } = errorResponse;
            if ([401, 403].includes(status)) {
              this.storage.clear();
              this.router.navigate(['/login']);
            }
            return throwError(errorResponse);
          })
        );
      })
    );
  }
}
