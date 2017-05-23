import { Injectable, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation, MockLocationStrategy } from '@angular/common/testing';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Load the implementations that should be tested
import { Auth } from '../@services/auth.service';
import { PayPalService } from '../@services/paypal.service';
import { LocalStorageService } from 'ngx-webstorage';
import { HomeComponent } from './home.component';

describe(`HomeComponent`, () => {
  let comp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: MockAuth;
  let localStorageService: LocalStorageService;
  let activatedRoute: ActivatedRouteStub;
  let location: SpyLocation;
  let paypalService: PayPalService;

  @Injectable()
  class ActivatedRouteStub {

    // ActivatedRoute.params is Observable
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    // Test parameters
    private _testParams: {};
    get testParams() { return this._testParams; }
    set testParams(params: {}) {
      this._testParams = params;
      this.subject.next(params);
    }

    // ActivatedRoute.snapshot.params
    get snapshot() {
      return { params: this.testParams };
    }
  }

  class MockAuth {
    public authenticated: boolean;

    public isAuthenticated(): boolean {
      return this.authenticated;
    }

    public checkUserHasRole(): any {
      return true;
    }
  }

  // async beforeEach
  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'home/payment/:status', component: HomeComponent }])],
      declarations: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        PayPalService,
        LocalStorageService,
        SpyLocation,
        LocationStrategy,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Auth, useClass: MockAuth },
        { provide: Location, useClass: SpyLocation },
        { provide: LocationStrategy, useClass: MockLocationStrategy }

      ]
    })
    .compileComponents(); // compile template and css
  }));

  describe(`initialization`, () => {
    // synchronous beforeEach
    beforeEach(() => {
      location = TestBed.get(Location);
      activatedRoute.testParams = { status: 'approved' };
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      authService = TestBed.get(Auth);
    });

    it('ngOnInit should check user authentication state', () => {
      spyOn(authService, 'isAuthenticated');
      authService.authenticated = true;
      fixture.detectChanges();
      expect(authService.isAuthenticated).toHaveBeenCalled();
    });

    it('ngOnInit should check if authenticated user has role', () => {
      spyOn(authService, 'checkUserHasRole');
      authService.authenticated = true;
      fixture.detectChanges();
      expect(authService.checkUserHasRole).toHaveBeenCalled();
    });
  });

  describe(`extended initialization when coming back from PayPal after payment cancel`, () => {
    // synchronous beforeEach
    beforeEach(() => {
      location = TestBed.get(Location);
      activatedRoute.testParams = { status: 'cancelled' };
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      authService = TestBed.get(Auth);
      paypalService = TestBed.get(PayPalService);
      localStorageService = TestBed.get(LocalStorageService);
    });

    it('ngOnInit should clear payKey from local storage', () => {
      spyOn(localStorageService, 'clear');
      authService.authenticated = true;
      fixture.detectChanges();
      expect(localStorageService.clear).toHaveBeenCalled();
    });

    it('ngOnInit should remove /payment/cancelled from url', fakeAsync(() => {
      spyOn(location, 'replaceState');
      authService.authenticated = true;
      comp.ngOnInit();
      tick(5000);
      expect(location.replaceState).toHaveBeenCalled();
    }));
  });
});
