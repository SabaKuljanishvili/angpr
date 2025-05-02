import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }
 
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.handle(req).pipe(
         catchError((error: HttpErrorResponse) => {
               if(error.status == 400) {
                 console.log("Bad Requset")
               }
               else{
                 console.log("Some Other Errors")
               }
               return throwError(() => error);
         } )
       )
   }
  }
