import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GroupPreferencesDto, PreferenceDto, PreferenceRequest } from '../models/preference.dto';

@Injectable({ providedIn: 'root' })
export class Preferences {
  constructor(private http: HttpClient) {}

  private url(tripId: string): string {
    return `${environment.apiUrl}/trips/${tripId}/preferences`;
  }

  get(tripId: string): Promise<GroupPreferencesDto> {
    return firstValueFrom(this.http.get<GroupPreferencesDto>(this.url(tripId)));
  }

  save(tripId: string, preferences: PreferenceRequest): Promise<PreferenceDto> {
    return firstValueFrom(this.http.put<PreferenceDto>(this.url(tripId), preferences));
  }
}
