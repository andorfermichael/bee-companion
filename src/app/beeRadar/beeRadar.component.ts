import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { NavComponent } from '../+nav';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'beeRadar'
  selector: 'beeRadar',  // <beeRadar></beeRadar>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  // providers: [
  //  Title
  // ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './beeRadar.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './beeRadar.component.html'
})
export class BeeRadarComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
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

  // TypeScript public modifiers
  constructor(
    public appState: AppState
  ) {}

  public setPosition(data: any) {
    console.log(data);
    if (data) {
      if (data.coords) {
        this.lat = data.coords.latitude ? data.coords.latitude : this.lat;
        this.lng = data.coords.longitude ? data.coords.longitude : this.lng;
      }
    }
  }

  public ngOnInit() {
    console.log('hello `beeRadar` component');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    };
   }
    // this.title.getData().subscribe(data => this.data = data);

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

}
