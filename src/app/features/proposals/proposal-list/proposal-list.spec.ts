import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ProposalList } from './proposal-list';

const proposal = (id: string, type: 'activity' | 'restaurant') => ({
  id,
  type,
  title: id,
  description: null,
  cost: null,
  location: null,
  location_lat: null,
  location_lon: null,
  diet_tags: [],
  created_by: { id: 'u', name: 'Ana', surname: 'T', alias: 'ana' },
  created_at: '',
  can_delete: false,
  incompatible_diets: type === 'restaurant' ? [{ tag: 'vegan', people: 2 }] : [],
});

describe('ProposalList', () => {
  let component: ProposalList;
  let fixture: ComponentFixture<ProposalList>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalList);
    fixture.componentRef.setInput('tripId', 'trip-1');
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    http
      .expectOne(`${environment.apiUrl}/trips/trip-1/proposals`)
      .flush([proposal('a', 'activity'), proposal('r', 'restaurant')]);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('shows the diet warning on incompatible restaurants', () => {
    const warning: HTMLElement = fixture.nativeElement.querySelector('.proposal-card__warning');
    expect(warning.textContent).toContain('vegana');
    expect(warning.textContent).toContain('2');
  });
});
