import { Directive, Input, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Observable } from 'rxjs';

import { MarkerIcon, ClusterOptions } from '../@config/google-maps.config';
import 'js-marker-clusterer/src/markerclusterer.js';

export declare const google;
export declare const MarkerClusterer;

@Directive({
  selector: 'marker-cluster'
})
export class MarkerClusterDirective implements OnInit {
  @Input() public points: any[];
  public markerCluster: any;
  public markers: any[] = [];

  constructor(private gmapsApi: GoogleMapsAPIWrapper) {}

  public ngOnInit() {
    this.gmapsApi.getNativeMap().then((map) => {
      Observable
        .interval(500)
        .skipWhile((s) => this.points == null || this.points.length <= 0)
        .take(1)
        .subscribe(() => {
          if (this.markerCluster) {
            this.markerCluster.clearMarkers();
          }

          if (this.points.length > 0) {
            for (const point of this.points) {
              const marker = new google.maps.Marker({
                position: new google.maps.LatLng(point.lat, point.lng),
                icon: MarkerIcon
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
