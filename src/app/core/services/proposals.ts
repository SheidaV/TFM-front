import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProposalDto, ProposalRequest } from '../models/proposal.dto';

@Injectable({ providedIn: 'root' })
export class Proposals {
  constructor(private http: HttpClient) {}

  private url(tripId: string): string {
    return `${environment.apiUrl}/trips/${tripId}/proposals`;
  }

  getAll(tripId: string): Promise<ProposalDto[]> {
    return firstValueFrom(this.http.get<ProposalDto[]>(this.url(tripId)));
  }

  create(tripId: string, proposal: ProposalRequest): Promise<ProposalDto> {
    return firstValueFrom(this.http.post<ProposalDto>(this.url(tripId), proposal));
  }

  delete(tripId: string, id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url(tripId)}/${id}`));
  }
}
