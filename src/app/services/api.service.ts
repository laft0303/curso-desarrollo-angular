import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/login';
import { User } from '../models/user';

const { server } = environment;


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api = `${server}/api/v1.0`;

  constructor(
    private http: HttpClient
  ) { }

  auth(login: Login): Observable<User> {
    return this.http.post<User>(`${this.api}/auth`, login);
  }

}
