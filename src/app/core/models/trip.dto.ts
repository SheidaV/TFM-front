export interface TripRequest {
  name: string;
  destination: string;
  destination_lat: number | null;
  destination_lon: number | null;
  start_date: string;
  end_date: string;
  budget: number | null;
}

export interface TripDto extends TripRequest {
  id: string;
  owner_id: string;
  role: 'owner' | 'participant';
  participants_count: number;
}
