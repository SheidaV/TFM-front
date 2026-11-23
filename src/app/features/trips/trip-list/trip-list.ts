import { DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TripDto } from '../../../core/models/trip.dto';
import { UserDto } from '../../../core/models/user.dto';
import { Trips } from '../../../core/services/trips';
import { Users } from '../../../core/services/users';
import { getErrorMessage } from '../../../core/utils/api-error';
import { getTripStatus, TripStatus, tripStatusLabels } from '../../../core/utils/trip-status';

type TripFilter = 'all' | 'upcoming' | 'finished';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-trip-list',
  styleUrl: './trip-list.scss',
  templateUrl: './trip-list.html',
})
export class TripList implements OnInit {
  user = signal<UserDto | null>(null);
  trips = signal<TripDto[]>([]);
  filter = signal<TripFilter>('all');
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  statusLabels = tripStatusLabels;

  // upcoming includes ongoing trips
  upcomingTrips = computed(() => this.trips().filter((t) => getTripStatus(t) !== 'finished'));
  finishedTrips = computed(() => this.trips().filter((t) => getTripStatus(t) === 'finished'));

  visibleTrips = computed(() => {
    switch (this.filter()) {
      case 'upcoming':
        return this.upcomingTrips();
      case 'finished':
        return this.finishedTrips();
      default:
        return this.trips();
    }
  });

  constructor(
    private users: Users,
    private tripsService: Trips,
  ) {}

  async ngOnInit() {
    try {
      const [user, trips] = await Promise.all([this.users.getMe(), this.tripsService.getAll()]);
      this.user.set(user);
      this.trips.set(trips);
    } catch (error) {
      this.errorMessage.set(getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  status(trip: TripDto): TripStatus {
    return getTripStatus(trip);
  }
}
