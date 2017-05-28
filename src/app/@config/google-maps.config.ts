export const GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

export const MarkerIconBeekeeper = {
  url: '../../assets/img/beekeeper-marker.png'
};

export const MarkerIconSupporter = {
  url: '../../assets/img/supporter-marker.png'
};

export const MarkerIconCurrent = {
  url: '../../assets/img/current-location-marker.png'
};

const clusterStyle = {
  url: '../../assets/img/cluster.png',
  height: 40,
  width: 40,
  textColor: '#FFF',
  textSize: 11,
  backgroundPosition: 'center center'
};

export const ClusterOptions = {
  imagePath: '../../assets/img/cluster',
  gridSize: 70,
  styles: [clusterStyle, clusterStyle, clusterStyle]
};

export const MapStyles = [{
  featureType: 'all',
  elementType: 'all',
  stylers: [
    {invert_lightness: true},
    {saturation: '0'},
    {lightness: '33'},
    {gamma: 0.5},
    {hue: '#ffcc00'},
    {weight: '1.51'}
  ]
}, {
  featureType: 'all', elementType: 'geometry.fill', stylers: [{saturation: '0'}]}, {
  featureType: 'poi',
  elementType: 'labels.icon',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'poi.attraction',
  elementType: 'labels.text',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'poi.attraction',
  elementType: 'labels.icon',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'road.highway',
  elementType: 'labels.text',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'road.highway',
  elementType: 'labels.icon',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'transit.station',
  elementType: 'geometry.fill',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'transit.station',
  elementType: 'labels.text',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'transit.station',
  elementType: 'labels.icon',
  stylers: [{visibility: 'off'}]
}, {
  featureType: 'transit.station.rail',
  elementType: 'labels.text',
  stylers: [{gamma: '1.00'}]
}, {
  featureType: 'transit.station.rail',
  elementType: 'labels.text.fill',
  stylers: [{hue: '#ff0000'}, {lightness: '42'}]
}, {
  featureType: 'transit.station.rail',
  elementType: 'labels.icon',
  stylers: [
    {hue: '#ff0000'},
    {invert_lightness: true},
    {lightness: '-15'},
    {saturation: '31'}
  ]
}];
