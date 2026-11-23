import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ItineraryView } from './itinerary-view';

describe('ItineraryView', () => {
  it('adding a proposal sends the chosen day and times', async () => {
    TestBed.configureTestingModule({
      imports: [ItineraryView],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(ItineraryView);
    fixture.componentRef.setInput('tripId', 'trip-1');
    const component = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);
    const url = `${environment.apiUrl}/trips/trip-1/itinerary`;
    const proposal = {
      id: 'p1',
      title: 'Alhambra',
      type: 'activity' as const,
      location: null,
      cost: null,
      status: 'accepted' as const,
    };

    fixture.detectChanges();
    http.expectOne(url).flush({
      can_edit: true,
      days: [{ date: '2027-05-14', outside_trip: false, items: [] }],
      available: [proposal],
    });
    await fixture.whenStable();

    component.startAdd(proposal);
    component.save();

    const req = http.expectOne((r) => r.method === 'POST');
    expect(req.request.body).toEqual({
      proposal_id: 'p1',
      date: '2027-05-14',
      start_time: '10:00',
      end_time: '11:00',
    });
  });
});
