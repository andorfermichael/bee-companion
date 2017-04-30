import {
  Component,
  Input,
  OnInit
} from '@angular/core';

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

  public ngOnInit() {}

}
