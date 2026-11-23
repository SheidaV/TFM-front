import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ProposalVote } from './proposal-vote';

describe('ProposalVote', () => {
  it('clicking my current vote again removes it', () => {
    TestBed.configureTestingModule({
      imports: [ProposalVote],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(ProposalVote);
    fixture.componentRef.setInput('proposal', {
      id: 'p1',
      my_vote: 1,
      votes_for: 1,
      votes_against: 0,
      status: 'pending',
    });
    const http = TestBed.inject(HttpTestingController);

    fixture.componentInstance.vote(1);

    const req = http.expectOne(`${environment.apiUrl}/proposals/p1/votes`);
    expect(req.request.method).toBe('DELETE');
  });
});
