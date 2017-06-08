import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LocalStorageService } from 'ngx-webstorage';
import { EventsService } from '../../@services/events.service';
import { GeolocationService } from '../../@services/geolocation.service';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';
import { GeolocationOptions, MapStyles } from '../../@config/google-maps.config';

const _ = require('lodash');

// Interface for type safety
interface Location {
  lat: number;
  lng: number;
  label?: string;
  role: string;
  url: string;
  username?: string;
}

@Component({
  selector: 'beeRadar',
  styleUrls: ['./beeRadar.component.scss'],
  templateUrl: './beeRadar.component.html'
})
export class BeeRadarComponent implements OnInit {
  public styles: any = MapStyles;
  public lat: number = 47.718757;
  public lng: number = 13.093238;
  public zoom: number = 11;
  public zoomControl: boolean = false;
  public disableDefaultUI: boolean = true;
  public mapDraggable: boolean = false;
  public disableDoubleClickZoom: boolean = true;
  public scrollwheel: boolean = true;
  public streetViewControl: boolean = false;

  public mapIsActive: boolean = true;
  public locations: Location[] = [];

  public displayFlag = 'map';

  private BASE_URL: string =
  process.env.ENV === 'development' ? 'http://localhost:8000' : 'https://bee-companion.com';

  private usersApiUrl: string =
    process.env.ENV === 'development' ? 'http://localhost:3000/api/users' :
      'https://bee-companion.com/api/users';

  constructor(public titleService: Title, public localStorage: LocalStorageService,
              public _eventsService: EventsService,
              public geolocationService: GeolocationService, public http: Http) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.BeeRadarComponent);

    this.fetchCurrentLocation().subscribe(
      () => {
        // Add current location
        this.locations.push(
          {lat: this.lat, lng: this.lng, role: 'Current', url: this.BASE_URL + '/#/user/me'}
        );
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public fetchUserLocations(bounds: any): any {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const params = {
      bounds
    };

    const requestOptions = new RequestOptions({
      headers
    });

    return this.http.post(this.usersApiUrl + '/locations', JSON.stringify(params), requestOptions)
      .map(this.extractData)
      .toPromise()
      .catch(this.handleError);
  }

  public fetchCurrentLocation(): Observable<any> {
    return Observable.create((observer) => {
      this.geolocationService.getLocation(GeolocationOptions)
        .subscribe(
          (location) => {
            if (location) {
              if (location.coords) {
                this.lat = location.coords.latitude ? location.coords.latitude : this.lat;
                this.lng = location.coords.longitude ? location.coords.longitude : this.lng;
                observer.next(location.coords);
                observer.complete();
              }
            }
          },
          (err) => {
            observer.error(err);
          }
        );
    });
  }

  public onBoundsChangedRedirect(bounds: any) {
    // Generate and add other users' locations
    this.fetchUserLocations(bounds)
      .then((data) => { this.generateLocationsFromData(data); })
      .catch((err) => { this.handleError(err); });
  }

  public toggleMap(): void {
    this.mapIsActive = !this.mapIsActive;
    this.localStorage.store('mapIsActive', this.mapIsActive);
    this._eventsService.broadcast('mapToggled');
  }

  private generateLocationsFromData(data: any): void {
    data.forEach((user) => {
      if (user.geographicLocation) {
        const generatedLocation = {
          username: user.username,
          lat: user.geographicLocation.coordinates[0],
          lng: user.geographicLocation.coordinates[1],
          role: user.role,
          url: this.BASE_URL + '/#/user/' + user.username
        };
        if (!_.some(this.locations, generatedLocation)) {
         this.locations.push(generatedLocation);
         console.log('USER LOC');
         console.log(generatedLocation);
        }
      }
    });
  }

  private extractData(res: Response) {
    return res.json() || { };
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      try {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } catch (e) {
        e = e ;
      }
    } else {
      errMsg = error.message ? error.message : 'An error ocurred!';
    }
    return Observable.throw(errMsg);
  }
}
