import {
  Component,
  Input,
  OnInit
} from '@angular/core';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`radarCard` component loaded asynchronously');

@Component({
  selector: 'radarCard',
  styleUrls: [ './radarCard.component.scss' ],
  templateUrl: './radarCard.component.html',
})
export class RadarCardComponent implements OnInit {
  @Input() public styles: any;
  @Input() public lat: number;
  @Input() public lng: number;
  @Input() public zoom: number;
  @Input() public zoomControl: boolean;
  @Input() public disableDefaultUI: boolean;
  @Input() public mapDraggable: boolean;
  @Input() public disableDoubleClickZoom: boolean;
  @Input() public scrollwheel: boolean;
  @Input() public streetViewControl: boolean;

  public ngOnInit() {
    console.log('hello `radarCard` component');
  }

}
