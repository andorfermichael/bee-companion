import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MainContentComponent } from '../../../@elements/+mainContent/mainContent.component';
import { Auth } from '../../../@services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { EventsService } from '../../../@services/events.service';

import { MockAuthService } from '../_doubles/auth.doubles'

describe('MainContentComponent', () => {
  let comp: MainContentComponent;
  let fixture: ComponentFixture<MainContentComponent>;
  let localStorageService: LocalStorageService;
  let eventsService: EventsService;
  let authService: MockAuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MainContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        LocalStorageService,
        EventsService,
        MockAuthService,
        { provide: Auth, useClass: MockAuthService },
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentComponent);
    comp = fixture.componentInstance;
    localStorageService = TestBed.get(LocalStorageService);
    eventsService = TestBed.get(EventsService);
    authService = TestBed.get(Auth);
  });

  it('ngOnInit should set "headerIsToggled" to true if local storage variable "headerIsToggled" is true', () => {
    authService.userProfile = {role: 'Beekeeper'};
    localStorageService.store('headerIsToggled', true);
    comp.ngOnInit();
    expect(comp.headerIsToggled).toEqual(true);
  });

  it('ngOnInit should set "headerIsToggled" to false if local storage variable "headerIsToggled" is false', () => {
    authService.userProfile = {role: 'Beekeeper'};
    localStorageService.store('headerIsToggled', false);
    comp.ngOnInit();
    expect(comp.headerIsToggled).toEqual(false);
  });

  it('ngOnInit should listen to  "headerToggled" broadcast and should set variable "headerIsToggled" to true', () => {
    authService.userProfile = {role: 'Beekeeper'};
    comp.ngOnInit();
    eventsService.broadcast('headerToggled', true);
    expect(comp.headerIsToggled).toEqual(true);
  });

  it('ngOnInit should set "userIsAdmin" to true if user has role admin', () => {
    authService.userProfile = {role: 'Admin'};
    comp.ngOnInit();
    expect(comp.userIsAdmin).toEqual(true);
  });
});
