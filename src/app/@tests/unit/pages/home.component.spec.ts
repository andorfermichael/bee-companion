import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation, MockLocationStrategy } from '@angular/common/testing';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { Title } from '@angular/platform-browser';

// Load the implementations that should be tested
import { Auth } from '../../../@services/auth.service';
import { PayPalService } from '../../../@services/paypal.service';
import { LocalStorageService } from 'ngx-webstorage';
import { EventsService } from '../../../@services/events.service';
import { HomeComponent } from '../../../@pages/home/home.component';

import { MockAuthService } from '../_doubles/auth.doubles';
import { ActivatedRouteStub } from '../_doubles/router.doubles';
import { MockPayPalService } from '../_doubles/paypal.service.doubles';

describe(`HomeComponent`, () => {
  let comp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: MockAuthService;
  let localStorageService: LocalStorageService;
  let activatedRoute: ActivatedRouteStub;
  let location: SpyLocation;
  let paypalService: MockPayPalService;
  let titleService: Title;

  // async beforeEach
  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'home/payment/:status', component: HomeComponent }])],
      declarations: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title,
        LocalStorageService,
        BaseRequestOptions,
        EventsService,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Auth, useClass: MockAuthService },
        { provide: Location, useClass: SpyLocation },
        { provide: LocationStrategy, useClass: MockLocationStrategy },
        { provide: PayPalService, useClass: MockPayPalService }
      ]
    })
    .compileComponents(); // compile template and css
  }));

  describe(`initialization`, () => {
    // synchronous beforeEach
    beforeEach(() => {
      location = TestBed.get(Location);
      activatedRoute.testParams = { status: 'approved' };
      activatedRoute.testQueryParams = { paymentId: 'PAY-8V631080519529720LEZMZHI', payerId: 'AD99B6LNWBMEQ' };
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      authService = TestBed.get(Auth);
      paypalService = TestBed.get(PayPalService);
      titleService = TestBed.get(Title);
    });

    it('ngOnInit should set page title', () => {
      authService.userProfile = {role: 'Beekeeper'};
      spyOn(titleService, 'setTitle');
      comp.ngOnInit();
      expect(titleService.setTitle).toHaveBeenCalled();
    });

    it('ngOnInit should check user authentication state', () => {
      spyOn(authService, 'isAuthenticated');
      authService.userProfile = {role: 'Beekeeper'};
      authService.authenticated = true;
      fixture.detectChanges();
      expect(authService.isAuthenticated).toHaveBeenCalled();
    });

    it('ngOnInit should check if authenticated user has role', () => {
      spyOn(authService, 'checkUserHasRole');
      authService.userProfile = {role: 'Beekeeper'};
      authService.authenticated = true;
      fixture.detectChanges();
      expect(authService.checkUserHasRole).toHaveBeenCalled();
    });
  });

  xdescribe(`extended initialization when coming back from PayPal after payment approval`, () => {
    // synchronous beforeEach
    beforeEach(() => {
      location = TestBed.get(Location);
      activatedRoute.testParams = { status: 'approved' };
      activatedRoute.testQueryParams = { paymentId: 'PAY-8V631080519529720LEZMZHI', payerId: 'AD99B6LNWBMEQ' };
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      authService = TestBed.get(Auth);
      paypalService = TestBed.get(PayPalService);
      localStorageService = TestBed.get(LocalStorageService);
    });

    it('ngOnInit should remove /payment/approved from url', fakeAsync(() => {
      spyOn(console, 'error');
      authService.userProfile = {role: 'Beekeeper'};
      authService.authenticated = true;
      comp.ngOnInit();
      tick(5000);
      expect(console.error).toHaveBeenCalled();
    }));
  });

  xdescribe(`extended initialization when coming back from PayPal after payment cancel`, () => {
    // synchronous beforeEach
    beforeEach(() => {
      location = TestBed.get(Location);
      activatedRoute.testParams = { status: 'approved' };
      activatedRoute.testQueryParams = { paymentId: 'PAY-8V631080519529720LEZMZHI', payerId: 'AD99B6LNWBMEQ' };
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      authService = TestBed.get(Auth);
      paypalService = TestBed.get(PayPalService);
      localStorageService = TestBed.get(LocalStorageService);
    });

    it('ngOnInit should remove /payment/cancelled from url', fakeAsync(() => {
      spyOn(location, 'replaceState');
      authService.userProfile = {role: 'Beekeeper'};
      authService.authenticated = true;
      comp.ngOnInit();
      tick(5000);
      expect(location.replaceState).toHaveBeenCalled();
    }));
  });
});
