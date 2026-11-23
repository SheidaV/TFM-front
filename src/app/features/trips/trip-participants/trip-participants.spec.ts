import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { TripParticipants } from './trip-participants';

describe('TripParticipants', () => {
  let component: TripParticipants;
  let fixture: ComponentFixture<TripParticipants>;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/trips/trip-1/participants`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripParticipants],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TripParticipants);
    fixture.componentRef.setInput('tripId', 'trip-1');
    fixture.componentRef.setInput('isOwner', true);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  it('submitting the invite form calls the API', async () => {
    fixture.detectChanges();
    http.expectOne(url).flush([]);
    await fixture.whenStable();

    component.identifier.setValue('test3');
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    const event = new Event('submit', { cancelable: true });
    form.dispatchEvent(event);

    // the page must not reload
    expect(event.defaultPrevented).toBe(true);
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ identifier: 'test3' });
  });
});
