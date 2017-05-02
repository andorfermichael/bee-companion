import { Component } from '@angular/core';

@Component({
  selector: 'beeRadar',
  styleUrls: ['./beeRadar.component.scss'],
  templateUrl: './beeRadar.component.html'
})
export class BeeRadarComponent {
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
  public lat = 56.713;
  public lng = 21.1644;
  public zoom = 11;
  public zoomControl = false;
  public disableDefaultUI = true;
  public mapDraggable = false;
  public disableDoubleClickZoom = true;
  public scrollwheel = false;
  public streetViewControl = false;
  public localState: any;

  public setPosition(data: any) {
    if (data) {
      if (data.coords) {
        this.lat = data.coords.latitude ? data.coords.latitude : this.lat;
        this.lng = data.coords.longitude ? data.coords.longitude : this.lng;
      }
    }
  }
}
