import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'api/employee'

  constructor(private http: HttpClient) { }

  loginEmployee(rfidValue: string): Observable<any>{
    const loginEmployeeUrl = `${this.apiUrl}log-access/${rfidValue}`;
    return this.http.post<any>(loginEmployeeUrl, rfidValue);
  }
}
