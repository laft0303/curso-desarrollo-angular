import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';
import { Login } from '../models/login';
import { User } from '../models/user';

import { environment } from './../../environments/environment';
const { server } = environment;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = `${server}/api/v1.0`;
  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) { }

  auth(login: Login): Observable<User> {
    return this.http.post<User>(`${this.api}/auth`, login);
  }

  isAuth(): boolean {
    return !!(this.storage.one('_user') && this.storage.one('_auth'));
  }

  logout() {
    this.storage.clear();
    this.router.navigate(['/login']);
  }
}
