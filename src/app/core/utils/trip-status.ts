import { formatDate } from '@angular/common';
import { TripDto } from '../models/trip.dto';

export type TripStatus = 'upcoming' | 'ongoing' | 'finished';

export const tripStatusLabels: Record<TripStatus, string> = {
  upcoming: 'Próximo',
  ongoing: 'En curso',
  finished: 'Finalizado',
};
export function getTripStatus(trip: TripDto): TripStatus {
  const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  if (today < trip.start_date) {
    return 'upcoming';
  }
  if (today > trip.end_date) {
    return 'finished';
  }
  return 'ongoing';
}
