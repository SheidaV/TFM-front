import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProposalDto } from '../models/proposal.dto';

@Injectable({ providedIn: 'root' })
export class Votes {
  constructor(private http: HttpClient) {}

  private url(proposalId: string): string {
    return `${environment.apiUrl}/proposals/${proposalId}/votes`;
  }

  vote(proposalId: string, value: 1 | -1): Promise<ProposalDto> {
    return firstValueFrom(this.http.put<ProposalDto>(this.url(proposalId), { value }));
  }

  remove(proposalId: string): Promise<ProposalDto> {
    return firstValueFrom(this.http.delete<ProposalDto>(this.url(proposalId)));
  }
}
