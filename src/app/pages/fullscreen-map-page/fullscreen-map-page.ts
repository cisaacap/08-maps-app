import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.html',
  styles: `
  div {
    width: 100vw;
    height: 40vw;
  }

  #controls {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    position: fixed;
    bottom: 25px;
    right: 20px;
    z-index: 9999;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    width: 250px;
  }

  `
})
export class FullscreenMapPage implements AfterViewInit {

  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);

  zoom = signal(14);
  coords = signal({
    lng: -75,
    lat: 40
  });
  zoomEffect = effect(() => {

    if(!this.map()) return;

    this.map()?.setZoom(this.zoom())

  })

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 800));

    const element = this.divElement()!.nativeElement;
    const { lng, lat } = this.coords();

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat], // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: this.zoom()
    });
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    this.map.set(map)
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom)
    });

    map.on('moveend', (event) => {
      const center = map.getCenter();
      this.coords.set(center)
    })

    map.addControl( new mapboxgl.FullscreenControl());
    map.addControl( new mapboxgl.ScaleControl());
    map.addControl( new mapboxgl.NavigationControl());
    map.addControl( new mapboxgl.AttributionControl());

  }
}
