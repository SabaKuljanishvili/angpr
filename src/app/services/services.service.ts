import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getDeparture(from: string, to: string, date: string): Observable<any> {
    const url = `https://railway.stepprojects.ge/api/getdeparture?from=${from}&to=${to}&date=${date}`;
    return this.http.get(url);
  }

  getStations(): Observable<any> {
    const url = 'https://railway.stepprojects.ge/api/stations';
    return this.http.get(url);
  }

  getTrains(): Observable<any> {
    const url = 'https://railway.stepprojects.ge/api/trains';
    return this.http.get(url);
  }

  getVagons(trainId: number): Observable<any> {
    const url = `https://railway.stepprojects.ge/api/vagons?trainId=${trainId}`;
    return this.http.get(url);
  }

  registerTicket(payload: any): Observable<any> {
    const url = 'https://railway.stepprojects.ge/api/tickets/register';
    return this.http.post(url, payload);
  }

  registerTicketWithSchema(payload: any): Observable<any> {
    const url = 'https://railway.stepprojects.ge/api/tickets/register';
    return this.http.post(url, payload);
  }
}