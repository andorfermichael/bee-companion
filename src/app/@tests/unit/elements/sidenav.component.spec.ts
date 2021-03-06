import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';

// Load the implementations that should be tested
import { Auth } from '../../../@services/auth.service';
import { EventsService } from '../../../@services/events.service';
import { SideNavComponent } from '../../../@elements/+sidenav/sidenav.component';

import { MockAuthService } from '../_doubles/auth.doubles'

describe(`SideNavComponent`, () => {
  let comp: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [SideNavComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EventsService,
        { provide: Auth, useClass: MockAuthService }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    comp = fixture.componentInstance;
  });

  it('setMenuActive should set right property in "menus" variable to true', () => {
    comp.setMenuActive(2);
    expect(comp.menus['1']).toEqual(false);
    expect(comp.menus['2']).toEqual(true);
    expect(comp.menus['3']).toEqual(false);
    expect(comp.menus['4']).toEqual(false);
  });

  it('isMenuActive should return true if given menu is active and false if not', () => {
    comp.setMenuActive(2);
    expect(comp.isMenuActive(1)).toEqual(false);
    expect(comp.isMenuActive(2)).toEqual(true);
    expect(comp.isMenuActive(3)).toEqual(false);
    expect(comp.isMenuActive(4)).toEqual(false);
  });

  it('isMenuActive should return true if any menu is active', () => {
    comp.setMenuActive(3);
    expect(comp.isMenuActive()).toEqual(true);
  });

  it('isMenuActive should return false if no menu is active', () => {
    expect(comp.isMenuActive()).toEqual(false);
  });
});

