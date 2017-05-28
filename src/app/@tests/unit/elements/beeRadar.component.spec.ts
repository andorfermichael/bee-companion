import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';
import { BeeRadarComponent } from '../../../@pages/beeRadar/beeRadar.component';
import { MainCardComponent } from '../../../@elements/+mainCard/mainCard.component';
import { MainContentRowComponent } from '../../../@elements/+mainContentRow/mainContentRow.component';
import { RadarCardComponent } from '../../../@elements/+radarCard/radarCard.component';
import { MainContentComponent} from '../../../@elements/+mainContent/mainContent.component';
import { NavComponent } from '../../../@elements/+nav/nav.component';

import { MockAuthService } from '../_doubles/auth.doubles'
import { Auth } from '../../../@services/auth.service';
import { EventsService } from '../../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';
import { BeeMapComponent } from '../../../@elements/+beeMap/beeMap.component';
import { SideNavComponent } from '../../../@elements/+sidenav';
import { SupporterMenuComponent } from '../../../@elements/+supporterMenu/spMenu.component';
import { BeekeeperMenuComponent } from '../../../@elements/+beekeeperMenu/bkMenu.component';
import { AdminMenuComponent } from '../../../@elements/+adminMenu/adminMenu.component';
import { GeolocationService } from '../../../@services/geolocation.service';
import { MarkerClusterDirective } from '../../../@directives/marker-cluster.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BeeRadarComponent', () => {
  let comp: BeeRadarComponent;
  let fixture: ComponentFixture<BeeRadarComponent>;
  let geolocationService: GeolocationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, AgmCoreModule.forRoot({ apiKey: process.env.GOOGLE_MAPS_API_KEY })],
      declarations: [
        BeeRadarComponent,
        RadarCardComponent,
        MainCardComponent,
        MainContentRowComponent,
        MainContentComponent,
        NavComponent,
        BeeMapComponent,
        SideNavComponent,
        MarkerClusterDirective,
        SupporterMenuComponent,
        BeekeeperMenuComponent,
        AdminMenuComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EventsService,
        LocalStorageService,
        GeolocationService,
        MarkerManager,
        GoogleMapsAPIWrapper,
        GeolocationService,
        { provide: Auth, useClass: MockAuthService },
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(BeeRadarComponent);
    comp = fixture.componentInstance;
    geolocationService = TestBed.get(GeolocationService);
  });

  it('toggleMap should toggle value of mapIsActive variable', () => {
    comp.toggleMap();
    expect(comp.mapIsActive).toEqual(false);
    comp.toggleMap();
    expect(comp.mapIsActive).toEqual(true);
  });

  it('ngOnInit should call "fetchCurrentLocation" to get current location', () => {
    spyOn(comp, 'fetchCurrentLocation');
    comp.ngOnInit();
    expect(comp.fetchCurrentLocation).toHaveBeenCalled();
  });

  it('fetchCurrentLocation should call "getLocation" from geolocation service and set lat and lng if successful', () => {
    spyOn(geolocationService, 'getLocation').and.returnValue(Observable.of({ coords: { latitude: 32, longitude: -96 } }));
    comp.fetchCurrentLocation();
    expect(geolocationService.getLocation).toHaveBeenCalledWith({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    expect(comp.lat).toEqual(32);
    expect(comp.lng).toEqual(-96);
  });

  it('fetchCurrentLocation should call "getLocation" from geolocation service and set lat and lng if successful', () => {
    spyOn(geolocationService, 'getLocation').and.returnValue(Observable.of({ coords: { latitude: 32, longitude: -96 } }));
    comp.fetchCurrentLocation();
    expect(geolocationService.getLocation).toHaveBeenCalledWith({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    expect(comp.lat).toEqual(32);
    expect(comp.lng).toEqual(-96);
  });

  it('fetchCurrentLocation should call "getLocation" from geolocation service and console error in case of any error', () => {
    spyOn(geolocationService, 'getLocation').and.returnValue(Observable.throw('location error'));
    spyOn(console, 'error');
    comp.fetchCurrentLocation();
    expect(geolocationService.getLocation).toHaveBeenCalledWith({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    expect(console.error).toHaveBeenCalledWith('location error');
  });
});
