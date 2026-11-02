import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterRequest, UserDto } from '../models/user.dto';

@Injectable({ providedIn: 'root' })
export class Users {
  private url = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  register(user: RegisterRequest): Promise<UserDto> {
    return firstValueFrom(this.http.post<UserDto>(this.url, user));
  }

  getMe(): Promise<UserDto> {
    return firstValueFrom(this.http.get<UserDto>(this.url + '/me'));
  }
}
