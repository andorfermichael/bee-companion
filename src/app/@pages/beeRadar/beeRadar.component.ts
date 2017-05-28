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

// Interface for type safety
interface Location {
  lat: number;
  lng: number;
  label?: string;
  role: string;
  url: string;
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
  public scrollwheel: boolean = false;
  public streetViewControl: boolean = false;

  public mapIsActive: boolean = true;
  public locations: Location[] = [];

  public displayFlag = 'map';

  private usersApiUrl: string = 'http://localhost:3000/api/users';
  private domain: string = null;

  constructor(public titleService: Title, public localStorage: LocalStorageService,
              public _eventsService: EventsService,
              public geolocationService: GeolocationService, public http: Http) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.BeeRadarComponent);

    if (process.env.NODE_ENV === 'development') {
      this.domain = 'http://localhost:8000';
    } else {
      this.domain = 'https://bee-companion.com';
    }

    this.fetchCurrentLocation().subscribe(
      (data) => {
        // Add current location
        this.locations.push(
          {lat: this.lat, lng: this.lng, role: 'Current', url: this.domain + '/me'}
        );
        // Generate and add other users' locations
        const usersLocations = this.fetchUserLocations();
        this.generateLocationsFromData(usersLocations);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public fetchUserLocations(): any {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const requestOptions = new RequestOptions({
      headers
    });

    return this.http.get(this.usersApiUrl + '/locations', requestOptions)
      .map(this.extractData)
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

  public toggleMap(): void {
    this.mapIsActive = !this.mapIsActive;
    this.localStorage.store('mapIsActive', this.mapIsActive);
    this._eventsService.broadcast('mapToggled');
  }

  private generateLocationsFromData(data: any): void {
    data.forEach((location) => {
      let generatedLocation = {
        lat: location[0].latitude,
        lng: location[0].longitude,
        role: location[0].role,
        url: this.domain + '/' + location[0].username
      };
      this.locations.push(generatedLocation);
    });
  }

  private extractData(res: Response) {
    return res.json() || { };
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
