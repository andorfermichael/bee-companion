import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { EventsService } from '../../@services/events.service';
import { GeolocationService } from '../../@services/geolocation.service';
import { AgmMarker, MarkerManager } from '@agm/core';

import { fakeBeekeeperPositions } from '../../@tests/unit/_doubles/geolocation.doubles';

// Interface for type safety
interface Marker {
  lat: number;
  lng: number;
  label?: string;
}

@Component({
  selector: 'beeRadar',
  styleUrls: ['./beeRadar.component.scss'],
  templateUrl: './beeRadar.component.html'
})
export class BeeRadarComponent implements OnInit {
  public styles: any = [{
    featureType: 'all',
    elementType: 'all',
    stylers: [
      {invert_lightness: true},
      {saturation: '0'},
      {lightness: '33'},
      {gamma: 0.5},
      {hue: '#ffcc00'},
      {weight: '1.51'}
    ]
  }, {
    featureType: 'all', elementType: 'geometry.fill', stylers: [{saturation: '0'}]}, {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'poi.attraction',
    elementType: 'labels.text',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'poi.attraction',
    elementType: 'labels.icon',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'road.highway',
    elementType: 'labels.text',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'transit.station',
    elementType: 'geometry.fill',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'transit.station',
    elementType: 'labels.text',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'transit.station',
    elementType: 'labels.icon',
    stylers: [{visibility: 'off'}]
  }, {
    featureType: 'transit.station.rail',
    elementType: 'labels.text',
    stylers: [{gamma: '1.00'}]
  }, {
    featureType: 'transit.station.rail',
    elementType: 'labels.text.fill',
    stylers: [{hue: '#ff0000'}, {lightness: '42'}]
  }, {
    featureType: 'transit.station.rail',
    elementType: 'labels.icon',
    stylers: [
      {hue: '#ff0000'},
      {invert_lightness: true},
      {lightness: '-15'},
      {saturation: '31'}
    ]
  }];
  public lat: number = 47.718757;
  public lng: number = 13.093238;
  public zoom: number = 11;
  public zoomControl: boolean = false;
  public disableDefaultUI: boolean = true;
  public mapDraggable: boolean = false;
  public disableDoubleClickZoom: boolean = true;
  public scrollwheel: boolean = false;
  public streetViewControl: boolean = false;
  public mapIsActive: boolean = false;
  public markers: Marker[] = fakeBeekeeperPositions;
  public agmMarkers: AgmMarker[] = [];

  constructor(private localStorage: LocalStorageService, public _eventsService: EventsService,
              private geolocationService: GeolocationService,
              private _markerManager: MarkerManager) {}

  public ngOnInit() {
    this.fetchCurrentLocation();
    this.convertMarkers();
  }

  public fetchCurrentLocation(): void {
    this.geolocationService.getLocation({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
      .subscribe(
        (location) => {
          if (location) {
            if (location.coords) {
              this.lat = location.coords.latitude ? location.coords.latitude : this.lat;
              this.lng = location.coords.longitude ? location.coords.longitude : this.lng;
            }
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  public toggleMap(): void {
    this.mapIsActive = !this.mapIsActive;
    this.localStorage.store('mapIsActive', this.mapIsActive);
    this._eventsService.broadcast('mapToggled');
  }

  private convertMarkers(): void {
    for (const marker of this.markers) {
      const agmMarker = new AgmMarker(this._markerManager);
      agmMarker.latitude = marker.lat;
      agmMarker.longitude = marker.lng;
      agmMarker.label = marker.label;
      this.agmMarkers.push(agmMarker);
    }
  }
}
