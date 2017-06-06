import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'beeMap',
  styleUrls: [ './beeMap.component.scss' ],
  templateUrl: './beeMap.component.html',
})
export class BeeMapComponent {
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
  @Input() public locations: any;
  @Output() public onBoundsChangedRedirect = new EventEmitter<any>();

  public onBoundsChanged(bounds: any) {
    this.onBoundsChangedRedirect.emit(bounds);
  }
}
