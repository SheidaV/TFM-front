import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { PreferencesForm } from './preferences-form';

describe('PreferencesForm', () => {
  let component: PreferencesForm;
  let fixture: ComponentFixture<PreferencesForm>;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/trips/trip-1/preferences`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesForm);
    fixture.componentRef.setInput('tripId', 'trip-1');
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  it('submitting sends the selected options with PUT', async () => {
    fixture.detectChanges();
    http.expectOne(url).flush({
      mine: null,
      responses: 0,
      participants: 1,
      food: {},
      activities: {},
    });
    await fixture.whenStable();

    component.toggle(component.food, 'gluten_free');
    const event = new Event('submit', { cancelable: true });
    fixture.nativeElement.querySelector('form').dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    const req = http.expectOne((r) => r.method === 'PUT');
    expect(req.request.body).toEqual({ food: ['gluten_free'], activities: [] });
  });
});
