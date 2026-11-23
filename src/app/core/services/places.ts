import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Place, PlaceSearchOptions } from '../models/place';

// Photon response, only the fields we use
interface PhotonResponse {
  features: {
    geometry: { coordinates: [number, number] };
    properties: {
      name?: string;
      city?: string;
      state?: string;
      country?: string;
      type?: string;
    };
  }[];
}

const typeLabels: Record<string, string> = {
  country: 'País',
  state: 'Región',
  county: 'Provincia',
  city: 'Ciudad',
};

// place search with Photon (OpenStreetMap), no API key needed
@Injectable({ providedIn: 'root' })
export class Places {
  private url = 'https://photon.komoot.io/api/';

  constructor(private http: HttpClient) {}

  search(text: string, options: PlaceSearchOptions = { scope: 'region' }): Observable<Place[]> {
    const params: Record<string, string | number | string[]> = {
      q: text,
      limit: 6,
      lang: 'en',
    };
    if (options.scope === 'region') {
      params['layer'] = Object.keys(typeLabels);
    }
    // results near the trip destination first
    if (options.near) {
      params['lat'] = options.near.lat;
      params['lon'] = options.near.lon;
    }

    return this.http.get<PhotonResponse>(this.url, { params }).pipe(
      map((response) => {
        const places = response.features.map((feature) => {
          const p = feature.properties;
          // e.g. "Granada, Andalusia, Spain" without repeated parts
          const parts = [p.name, p.city, p.state, p.country].filter(
            (part, i, all): part is string => !!part && all.indexOf(part) === i,
          );
          const [lon, lat] = feature.geometry.coordinates;
          return { name: parts.join(', '), lat, lon, type: typeLabels[p.type ?? ''] };
        });
        // city and county can have the same name
        return places.filter((place, i) => places.findIndex((x) => x.name === place.name) === i);
      }),
    );
  }

  static googleMapsUrl(lat: number, lon: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
}
