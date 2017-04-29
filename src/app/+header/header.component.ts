import {
  Component,
  OnInit,
} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Header` component loaded asynchronously');

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

  public processLocation(data: any) {
    console.log(data);
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
    this.message = 'Unfortunately we could not aquire your location which is recommended ' +
                   'for best user experience with our service.';
    this.messageType = 'danger';
  }

  public enableNavigatorLocation() {
    console.log('NaviatiorLocation');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.processLocation.bind(this),
        this.locationError.bind(this)
      );
    }
  }

  public ngOnInit() {
    console.log('hello `Header` component');
  }

}
