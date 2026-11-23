import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthToken, LoginRequest } from '../models/auth.dto';
import { LocalStorage } from '../services/local-storage';

@Injectable({ providedIn: 'root' })
export class Auth {
  private url = environment.apiUrl + '/auth';
  readonly loggedIn = signal(false);

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorage,
  ) {
    this.loggedIn.set(this.isLoggedIn());
  }

  async login(credentials: LoginRequest): Promise<AuthToken> {
    const authToken = await firstValueFrom(this.http.post<AuthToken>(this.url, credentials));

    this.localStorage.set('user_id', authToken.user_id);
    this.localStorage.set('access_token', authToken.access_token);
    this.loggedIn.set(true);

    return authToken;
  }

  logout(): void {
    this.localStorage.remove('user_id');
    this.localStorage.remove('access_token');
    this.loggedIn.set(false);
  }

  getToken(): string | null {
    return this.localStorage.get('access_token');
  }

  getUserId(): string | null {
    return this.localStorage.get('user_id');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
