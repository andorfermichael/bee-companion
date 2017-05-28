import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { EventsService } from '../../@services/events.service';
import { GeolocationService } from '../../@services/geolocation.service';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';
import { MapStyles } from '../../@config/google-maps.config';

import { fakeBeekeeperPositions } from '../../@tests/unit/_doubles/geolocation.doubles';

// Interface for type safety
interface Position {
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
  public points: Position[] = fakeBeekeeperPositions;

  public displayFlag = 'map';

  constructor(private titleService: Title, private localStorage: LocalStorageService,
              public _eventsService: EventsService,
              private geolocationService: GeolocationService) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.BeeRadarComponent);
    this.fetchCurrentLocation();
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
}
