import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ParticipantDto } from '../models/participant.dto';

@Injectable({ providedIn: 'root' })
export class Participants {
  constructor(private http: HttpClient) {}

  private url(tripId: string): string {
    return `${environment.apiUrl}/trips/${tripId}/participants`;
  }

  getAll(tripId: string): Promise<ParticipantDto[]> {
    return firstValueFrom(this.http.get<ParticipantDto[]>(this.url(tripId)));
  }

  invite(tripId: string, identifier: string): Promise<ParticipantDto> {
    return firstValueFrom(this.http.post<ParticipantDto>(this.url(tripId), { identifier }));
  }

  remove(tripId: string, userId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url(tripId)}/${userId}`));
  }
}
