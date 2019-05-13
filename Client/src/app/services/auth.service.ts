import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static TOKEN_KEY = 'token';

  constructor(private _http: HttpClient) {
  }

  signIn(code: string) {
    return this._http.post(environment.backendUrl + '/google-auth', {code});
  }

  saveToken(token: string) {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(AuthService.TOKEN_KEY);
  }
}
