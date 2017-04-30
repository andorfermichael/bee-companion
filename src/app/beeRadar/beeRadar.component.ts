import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'beeRadar',
  styleUrls: [ './beeRadar.component.scss' ],
  templateUrl: './beeRadar.component.html'
})
export class BeeRadarComponent implements OnInit {
  lat: number = 56.713;
  lng: number = 21.1644;
  styles: any = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":"0"},{"lightness":"33"},{"gamma":0.5},{"hue":"#ffcc00"},{"weight":"1.51"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"saturation":"0"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels.text","stylers":[{"gamma":"1.00"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"},{"lightness":"42"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff0000"},{"invert_lightness":true},{"lightness":"-15"},{"saturation":"31"}]}];
  zoom: number = 11;
  zoomControl: boolean = false;
  disableDefaultUI: boolean = true;
  mapDraggable: boolean = false;
  disableDoubleClickZoom: boolean = true;
  scrollwheel: boolean = false;
  streetViewControl: boolean = false;

  constructor() {}

  public setPosition(data: any) {
    if (data) {
      if (data.coords) {
        this.lat = data.coords.latitude ? data.coords.latitude : this.lat;
        this.lng = data.coords.longitude ? data.coords.longitude : this.lng;
      }
    }
  }

  public ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
  }
}
