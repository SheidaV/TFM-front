import { formatDate } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Place } from '../../../core/models/place';
import { TripRequest } from '../../../core/models/trip.dto';
import { Trips } from '../../../core/services/trips';
import { getErrorMessage } from '../../../core/utils/api-error';
import { PlaceAutocomplete } from '../../../shared/components/place-autocomplete/place-autocomplete';

type TripFormModel = {
  name: FormControl<string>;
  destination: FormControl<Place | null>;
  start_date: FormControl<string>;
  end_date: FormControl<string>;
  budget: FormControl<number | null>;
};

function datesInOrder(group: AbstractControl): ValidationErrors | null {
  const start = group.get('start_date')?.value;
  const end = group.get('end_date')?.value;
  return start && end && end < start ? { datesOrder: true } : null;
}

@Component({
  imports: [ReactiveFormsModule, RouterLink, PlaceAutocomplete],
  selector: 'app-trip-form',
  styleUrl: './trip-form.scss',
  templateUrl: './trip-form.html',
})
export class TripForm implements OnInit {
  name: FormControl<string>;
  destination: FormControl<Place | null>;
  start_date: FormControl<string>;
  end_date: FormControl<string>;
  budget: FormControl<number | null>;
  tripForm: FormGroup<TripFormModel>;

  tripId: string | null = null;
  // old trips without coordinates
  oldDestination = signal<string | null>(null);
  isValidForm = signal<boolean | null>(null);
  errorMessage = signal<string | null>(null);
  saving = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private trips: Trips,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.name = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    });

    // must be picked from the suggestions
    this.destination = new FormControl<Place | null>(null, {
      validators: [Validators.required],
    });

    // today by default
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.start_date = new FormControl(today, {
      nonNullable: true,
      validators: [Validators.required],
    });

    this.end_date = new FormControl(today, {
      nonNullable: true,
      validators: [Validators.required],
    });

    this.budget = new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    });

    this.tripForm = this.formBuilder.group(
      {
        name: this.name,
        destination: this.destination,
        start_date: this.start_date,
        end_date: this.end_date,
        budget: this.budget,
      },
      { validators: datesInOrder },
    );

    // end date follows start date
    this.start_date.valueChanges.pipe(takeUntilDestroyed()).subscribe((start) => {
      if (start && this.end_date.value && this.end_date.value < start) {
        this.end_date.setValue(start);
      }
    });
  }

  get isEdit(): boolean {
    return this.tripId !== null;
  }

  async ngOnInit() {
    this.tripId = this.route.snapshot.paramMap.get('id');
    if (!this.tripId) {
      return;
    }

    try {
      const trip = await this.trips.getById(this.tripId);
      const hasCoordinates = trip.destination_lat !== null && trip.destination_lon !== null;
      if (!hasCoordinates) {
        this.oldDestination.set(trip.destination);
      }

      this.tripForm.setValue({
        name: trip.name,
        destination: hasCoordinates
          ? { name: trip.destination, lat: trip.destination_lat!, lon: trip.destination_lon! }
          : null,
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget: trip.budget,
      });
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }

  async save(): Promise<void> {
    this.isValidForm.set(false);
    this.errorMessage.set(null);

    if (this.tripForm.invalid) {
      return;
    }

    this.isValidForm.set(true);
    this.saving.set(true);

    try {
      const data = this.toRequest();
      const trip = this.tripId
        ? await this.trips.update(this.tripId, data)
        : await this.trips.create(data);
      this.router.navigate(['/trips', trip.id]);
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }

  private toRequest(): TripRequest {
    const { destination, ...rest } = this.tripForm.getRawValue();
    return {
      ...rest,
      destination: destination!.name,
      destination_lat: destination!.lat,
      destination_lon: destination!.lon,
    };
  }
}
