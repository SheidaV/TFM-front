import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TripDto, TripRequest } from '../models/trip.dto';

@Injectable({ providedIn: 'root' })
export class Trips {
  private url = environment.apiUrl + '/trips';

  constructor(private http: HttpClient) {}

  getAll(): Promise<TripDto[]> {
    return firstValueFrom(this.http.get<TripDto[]>(this.url));
  }

  getById(id: string): Promise<TripDto> {
    return firstValueFrom(this.http.get<TripDto>(`${this.url}/${id}`));
  }

  create(trip: TripRequest): Promise<TripDto> {
    return firstValueFrom(this.http.post<TripDto>(this.url, trip));
  }

  update(id: string, trip: Partial<TripRequest>): Promise<TripDto> {
    return firstValueFrom(this.http.patch<TripDto>(`${this.url}/${id}`, trip));
  }

  delete(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }
}
