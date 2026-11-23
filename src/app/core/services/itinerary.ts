import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ItineraryDto, ItinerarySlot } from '../models/itinerary.dto';

@Injectable({ providedIn: 'root' })
export class Itinerary {
  constructor(private http: HttpClient) {}

  private url(tripId: string): string {
    return `${environment.apiUrl}/trips/${tripId}/itinerary`;
  }

  get(tripId: string): Promise<ItineraryDto> {
    return firstValueFrom(this.http.get<ItineraryDto>(this.url(tripId)));
  }

  add(tripId: string, proposalId: string, slot: ItinerarySlot): Promise<ItineraryDto> {
    return firstValueFrom(
      this.http.post<ItineraryDto>(this.url(tripId), { proposal_id: proposalId, ...slot }),
    );
  }

  update(tripId: string, itemId: string, slot: ItinerarySlot): Promise<ItineraryDto> {
    return firstValueFrom(this.http.patch<ItineraryDto>(`${this.url(tripId)}/${itemId}`, slot));
  }

  remove(tripId: string, itemId: string): Promise<ItineraryDto> {
    return firstValueFrom(this.http.delete<ItineraryDto>(`${this.url(tripId)}/${itemId}`));
  }
}
