import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from '../../../@elements/+header/header.component';
import { Auth } from '../../../@services/auth.service';
import { EventsService } from '../../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';
import { GeolocationService } from '../../../@services/geolocation.service'

import { MockAuthService } from '../_doubles/auth.doubles'

describe('HeaderComponent', () => {
  let comp: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let geolocationService: GeolocationService;
  let localStorageService: LocalStorageService;
  let eventsService: EventsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EventsService,
        LocalStorageService,
        GeolocationService,
        { provide: Auth, useClass: MockAuthService }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    comp = fixture.componentInstance;
    geolocationService = TestBed.get(GeolocationService);
    localStorageService = TestBed.get(LocalStorageService);
    eventsService = TestBed.get(EventsService);
  });

  it('enableNavigatorLocation should call "getLocation" and set lat and lng if successful', () => {
    spyOn(geolocationService, 'getLocation').and.returnValue(Observable.of({ coords: { latitude: 32, longitude: -96 } }));
    comp.enableNavigatorLocation();
    expect(geolocationService.getLocation).toHaveBeenCalled();
    expect(comp.lat).toEqual(32);
    expect(comp.lng).toEqual(-96);
  });

  it('enableNavigatorLocation should call "getLocation" and set error message if not successful', () => {
    spyOn(geolocationService, 'getLocation').and.returnValue(Observable.throw('error'));
    comp.enableNavigatorLocation();
    expect(geolocationService.getLocation).toHaveBeenCalled();
    expect(comp.message).not.toBe(null);
    expect(comp.messageType).toEqual('danger');
  });

  it('ngOnInit should set "isToggled" to true if local storage variable "headerIsToggled" is true', () => {
    localStorageService.store('headerIsToggled', true);
    comp.ngOnInit();
    expect(comp.isToggled).toEqual(true);
  });

  it('ngOnInit should set "isToggled" to false if local storage variable "headerIsToggled" is false', () => {
    localStorageService.store('headerIsToggled', false);
    comp.ngOnInit();
    expect(comp.isToggled).toEqual(false);
  });

  it('ngOnInit should set listener on "headerToggled" broadcast', () => {
    spyOn(eventsService, 'on');
    comp.ngOnInit();
    expect(eventsService.on).toHaveBeenCalledWith('headerToggled', jasmine.any(Function));
  });

  it('toggleHeader should send broadcast "headerToggled" true and listener should set variable "isToggled" and local storage "headerIsToggled" to true', () => {
    comp.ngOnInit();
    comp.toggleHeader(true);
    expect(comp.isToggled).toEqual(true);
    expect(localStorageService.retrieve('headerIsToggled')).toEqual(true);
  });
});
