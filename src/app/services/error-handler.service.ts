import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }


  dialogSubject = new Subject<any>();
  dialogSatte = this.dialogSubject.asObservable();


  showDialog(message: string = "Error Occured") {
    this.dialogSubject.next({ message: message, show: true });
  }

  hideDialog() {
    this.dialogSubject.next({ show: false });
  }

}
