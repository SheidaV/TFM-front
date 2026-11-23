export interface PreferenceRequest {
  food: string[];
  activities: string[];
}

export interface PreferenceDto extends PreferenceRequest {
  updated_at: string;
}

export interface GroupPreferencesDto {
  mine: PreferenceDto | null;
  responses: number;
  participants: number;
  food: Record<string, number>;
  activities: Record<string, number>;
}

export interface PreferenceOption {
  value: string;
  label: string;
}

// same values as the backend (preference-options.ts)
export const foodOptions: PreferenceOption[] = [
  { value: 'vegetarian', label: 'Vegetariana' },
  { value: 'vegan', label: 'Vegana' },
  { value: 'gluten_free', label: 'Sin gluten' },
  { value: 'lactose_free', label: 'Sin lactosa' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

export const activityOptions: PreferenceOption[] = [
  { value: 'culture', label: 'Cultura' },
  { value: 'gastronomy', label: 'Gastronomía' },
  { value: 'nature', label: 'Naturaleza' },
  { value: 'beach', label: 'Playa' },
  { value: 'nightlife', label: 'Vida nocturna' },
  { value: 'sports', label: 'Deporte' },
  { value: 'shopping', label: 'Compras' },
  { value: 'relax', label: 'Relax' },
];
