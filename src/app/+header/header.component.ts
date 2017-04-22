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
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './header.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  lat: number = 56.713;
  lng: number = 21.1644;
  message: string;
  messageType: string;

  // public showAlert(msg: string, type: string) {
  //   this.messageType = type;
  //   this.message = msg;
  // }

  public processLocation(data: any) {
    console.log(data);
    if (data) {
      if (data.coords) {
        this.lat = data.coords.latitude ? data.coords.latitude : this.lat;
        this.lng = data.coords.longitude ? data.coords.longitude : this.lng;
        this.messageType = 'success';
        this.message = 'You successfully granted us retrieving your location to enhance your experience with BeeCompanion.', 'success';
      }
    }
  }  

  public locationError() {
    this.message = 'Unfortunately we could not aquire your location which is recommended for best user experience with our service.';
    this.messageType = 'danger';
  }  

  public enableNavigatorLocation() {
    console.log("NaviatiorLocation");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.processLocation.bind(this), this.locationError.bind(this));
    };
    // navigator.geolocation.getCurrentPosition(this.processLocation,this.locationError,{
    //   timeout: 6000,
    //   enableHighAccuracy: true,
    //   maximumAge: 0
    // });
  }

  public ngOnInit() {
    console.log('hello `Header` component');
  }

}
