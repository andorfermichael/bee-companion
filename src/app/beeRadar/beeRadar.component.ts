import {
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'beeRadar',
  styleUrls: [ './beeRadar.component.scss' ],
  templateUrl: './beeRadar.component.html'
})
export class BeeRadarComponent implements OnInit {
  // Set our default values
  public lat: number = 56.713;
  public lng: number = 21.1644;
  public styles: any = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":"0"},{"lightness":"33"},{"gamma":0.5},{"hue":"#ffcc00"},{"weight":"1.51"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"saturation":"0"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"labels.text","stylers":[{"gamma":"1.00"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"},{"lightness":"42"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff0000"},{"invert_lightness":true},{"lightness":"-15"},{"saturation":"31"}]}];
  public zoom: number = 11;
  public zoomControl: boolean = false;
  public disableDefaultUI: boolean = true;
  public mapDraggable: boolean = false;
  public disableDoubleClickZoom: boolean = true;
  public scrollwheel: boolean = false;
  public streetViewControl: boolean = false;
  public localState: any;

  constructor(public route: ActivatedRoute) {}

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
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }

    console.log('hello `AboutUs` component');
    // static data that is bundled
    // var mockData = require('assets/mock-data/mock-data.json');
    // console.log('mockData', mockData);
    // if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
    this.asyncDataWithWebpack();
  }

  private asyncDataWithWebpack() {
    // you can also async load mock data with 'es6-promise-loader'
    // you would do this if you don't want the mock-data bundled
    // remember that 'es6-promise-loader' is a promise
    setTimeout(() => {

      System.import('../../assets/mock-data/mock-data.json')
        .then((json) => {
          console.log('async mockData', json);
          this.localState = json;
        });

    });
  }
}
