import { afterNextRender, Component, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
import * as L from 'leaflet';

// trip destination map (Leaflet + OpenStreetMap)
@Component({
  selector: 'app-trip-map',
  template: '<div #map class="trip-map"></div>',
  styles: `
    .trip-map {
      width: 100%;
      height: 100%;
      min-height: 160px;
      border-radius: 5px;
    }
  `,
})
export class TripMap implements OnDestroy {
  lat = input.required<number>();
  lon = input.required<number>();
  label = input('');

  private mapElement = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private map: L.Map | null = null;

  constructor() {
    // Leaflet needs the element in the DOM
    afterNextRender(() => {
      const position: L.LatLngExpression = [this.lat(), this.lon()];

      this.map = L.map(this.mapElement().nativeElement, { scrollWheelZoom: false }).setView(
        position,
        10,
      );

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; colaboradores de OpenStreetMap',
      }).addTo(this.map);

      // circleMarker doesn't need Leaflet icon images
      L.circleMarker(position, { radius: 9, color: '#1976d2', fillOpacity: 0.8 })
        .addTo(this.map)
        .bindTooltip(this.label());
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
