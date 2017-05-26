import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgmCoreModule } from '@agm/core';
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
import { GeolocationService } from '../../../@services/geolocation.service';

describe('BeeRadarComponent', () => {
  let comp: BeeRadarComponent;
  let fixture: ComponentFixture<BeeRadarComponent>;

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
        BeeMapComponent
      ],
      providers: [
        EventsService,
        LocalStorageService,
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
  });

  it('toggleMap should toggle value of mapIsActive variable', () => {
    comp.toggleMap();
    expect(comp.mapIsActive).toEqual(true);
    comp.toggleMap();
    expect(comp.mapIsActive).toEqual(false);
  });

  it('ngOnInit should call "fetchCurrentLocation" to get current location', () => {
    spyOn(comp, 'fetchCurrentLocation');
    comp.ngOnInit();
    expect(comp.fetchCurrentLocation).toHaveBeenCalled();
  });
});
