import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private erroHanler : ErrorHandlerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError((error:HttpResponse<any>) => {
              if(error.status == 400) {
                console.log("Bad Requset")
                this.erroHanler.showDialog(error.statusText)
              }
              else{
                console.log("Some Other Errors")
              }
              
              this.erroHanler.showDialog("Error Occured")

              return of()

              // throw error
     
      
             
        } )
      )
  }

  
}
