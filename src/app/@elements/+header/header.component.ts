import { Component, OnInit } from '@angular/core';
import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'header',
  styleUrls: [ './header.component.scss' ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public lat: number = 56.713;
  public lng: number = 21.1644;
  public message: string;
  public messageType: string;
  public isToggled: boolean = false;

  constructor(public auth: Auth, public _eventsService: EventsService,
              private localStorage: LocalStorageService) {
  }

  public processLocation(data: any) {
    if (data) {
      if (data.coords) {
        this.lat = data.coords.latitude ? data.coords.latitude : this.lat;
        this.lng = data.coords.longitude ? data.coords.longitude : this.lng;
        this.messageType = 'success';
        this.message = 'You successfully granted us retrieving your location to ' +
                       'enhance your experience with BeeCompanion.';
      }
    }
  }

  public locationError() {
    this.message = 'Unfortunately we could not acquire your location which is recommended ' +
                   'for best user experience with our service.';
    this.messageType = 'danger';
  }

  public enableNavigatorLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.processLocation.bind(this),
        this.locationError.bind(this)
      );
    }
  }

  public toggleHeader(toggle = !this.isToggled): void {
    this._eventsService.broadcast('headerToggled', toggle);
  }

  public ngOnInit() {
    this.isToggled = this.localStorage.retrieve('headerIsToggled');
    this._eventsService.on('headerToggled', (toggle) => {
      this.isToggled = toggle;
      this.localStorage.store('headerIsToggled', toggle);
    });
  }
}
