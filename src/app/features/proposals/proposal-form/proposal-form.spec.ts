import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProposalForm } from './proposal-form';

describe('ProposalForm', () => {
  let component: ProposalForm;
  let fixture: ComponentFixture<ProposalForm>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalForm);
    fixture.componentRef.setInput('tripId', 'trip-1');
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('activities are sent without diet tags', () => {
    component.title.setValue('Visita a la Alhambra');
    component.toggleDiet('vegan');
    component.save();

    const req = http.expectOne((r) => r.method === 'POST');
    expect(req.request.body).toEqual(
      expect.objectContaining({ type: 'activity', title: 'Visita a la Alhambra', diet_tags: [] }),
    );
  });
});
