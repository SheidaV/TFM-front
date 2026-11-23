import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripDto } from '../../../core/models/trip.dto';
import { Places } from '../../../core/services/places';
import { Trips } from '../../../core/services/trips';
import { getErrorMessage } from '../../../core/utils/api-error';
import { getTripStatus, tripStatusLabels } from '../../../core/utils/trip-status';
import { TripMap } from '../../../shared/components/trip-map/trip-map';

const DAY_MS = 24 * 60 * 60 * 1000;

@Component({
  imports: [RouterLink, DatePipe, DecimalPipe, TripMap],
  selector: 'app-trip-detail',
  styleUrl: './trip-detail.scss',
  templateUrl: './trip-detail.html',
})
export class TripDetail implements OnInit {
  trip = signal<TripDto | null>(null);
  errorMessage = signal<string | null>(null);

  isOwner = computed(() => this.trip()?.role === 'owner');
  status = computed(() => {
    const trip = this.trip();
    return trip ? getTripStatus(trip) : null;
  });
  statusLabels = tripStatusLabels;

  googleMapsUrl = computed(() => {
    const trip = this.trip();
    if (!trip || trip.destination_lat === null || trip.destination_lon === null) {
      return null;
    }
    return Places.googleMapsUrl(trip.destination_lat, trip.destination_lon);
  });

  // first and last day included
  days = computed(() => {
    const trip = this.trip();
    if (!trip) {
      return 0;
    }
    const start = new Date(trip.start_date).getTime();
    const end = new Date(trip.end_date).getTime();
    return Math.round((end - start) / DAY_MS) + 1;
  });

  constructor(
    private trips: Trips,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      this.trip.set(await this.trips.getById(id));
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }

  async deleteTrip(): Promise<void> {
    const trip = this.trip();
    if (!trip || !confirm(`¿Seguro que quieres eliminar "${trip.name}"? No se puede deshacer.`)) {
      return;
    }

    try {
      await this.trips.delete(trip.id);
      this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    }
  }
}
