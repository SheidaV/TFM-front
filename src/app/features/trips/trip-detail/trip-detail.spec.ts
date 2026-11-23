import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TripDetail } from './trip-detail';

describe('TripDetail', () => {
  let component: TripDetail;
  let fixture: ComponentFixture<TripDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetail],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
