export interface Place {
  name: string;
  lat: number;
  lon: number;
  type?: string;
}

// 'region': cities, regions and countries (trip destination)
// 'any': also restaurants, monuments, streets... (proposals)
export type PlaceScope = 'region' | 'any';

export interface PlaceSearchOptions {
  scope: PlaceScope;
  near?: { lat: number; lon: number } | null;
}
