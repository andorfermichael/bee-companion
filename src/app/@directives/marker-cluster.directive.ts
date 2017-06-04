import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Observable } from 'rxjs';

import {
  MarkerIconBeekeeper,
  MarkerIconSupporter,
  MarkerIconCurrent,
  ClusterOptions
} from '../@config/google-maps.config';
import 'js-marker-clusterer/src/markerclusterer.js';

export declare const google;
export declare const MarkerClusterer;

@Directive({
  selector: 'marker-cluster'
})
export class MarkerClusterDirective implements OnInit {
  @Input() public locations: any[];
  @Output() public onBoundsChanged = new EventEmitter<any>();
  public markerCluster: any;
  public markers: any[] = [];

  constructor(private gmapsApi: GoogleMapsAPIWrapper) {}

  public ngOnInit() {
    this.gmapsApi.getNativeMap().then((map) => {
      Observable
        .interval(500)
        .skipWhile((s) => this.locations == null || this.locations.length <= 0)
        .take(1)
        .subscribe(() => {
          let northEastLat = map.getBounds().getNorthEast().lat();
          let northEastLng = map.getBounds().getNorthEast().lng();
          let southWestLat = map.getBounds().getSouthWest().lat();
          let southWestLng = map.getBounds().getSouthWest().lng();
          let bounds = {northEastLat, northEastLng, southWestLat, southWestLng};

          this.onBoundsChanged.emit(bounds);

          // Update/Fetch locations on bound change
          google.maps.event.addListener(map, 'bounds_changed', () => {
            northEastLat = map.getBounds().getNorthEast().lat();
            northEastLng = map.getBounds().getNorthEast().lng();
            southWestLat = map.getBounds().getSouthWest().lat();
            southWestLng = map.getBounds().getSouthWest().lng();
            bounds = {northEastLat, northEastLng, southWestLat, southWestLng};

            this.onBoundsChanged.emit(bounds);
          });

          if (this.markerCluster) {
            this.markerCluster.clearMarkers();
          }

          if (this.locations.length > 0) {
            for (const location of this.locations) {
              let icon = null;
              if (location.role === 'Beekeeper') {
                icon = MarkerIconBeekeeper;
              } else if (location.role === 'Supporter') {
                icon = MarkerIconSupporter;
              } else if (location.role === 'Current') {
                icon = MarkerIconCurrent;
              }

              const marker = new google.maps.Marker({
                position: new google.maps.LatLng(location.lat, location.lng),
                icon,
                url: location.url
              });

              // Go to user page on click
              google.maps.event.addListener(marker, 'click', function() {
                // window.location.href = marker.url;
                window.open(this.url);
              });

              this.markers.push(marker);
            }
          } else {
            this.markers = [];
          }

          this.markerCluster = new MarkerClusterer(map, this.markers, ClusterOptions);
        });
    });
  }
}
