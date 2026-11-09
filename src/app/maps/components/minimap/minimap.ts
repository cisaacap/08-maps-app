import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-minimap',
  imports: [],
  templateUrl: './minimap.html',
  styles: `
  div {
    width: 100%;
    height: 260px
  }
  `
})
export class Minimap implements AfterViewInit {

  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);

  lngLat = input.required<{lng: number, lat:number}>()

    async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 800));

    const element = this.divElement()!.nativeElement;
    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.lngLat().lng, this.lngLat().lat], // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 14,
      interactive: false,
    });
    new mapboxgl.Marker().setLngLat(this.lngLat()).addTo(map);
  }

}
