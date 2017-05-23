import { Injectable, NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation, MockLocationStrategy } from '@angular/common/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Load the implementations that should be tested
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { Auth } from '../@services/auth.service';
import { PayPalService } from '../@services/paypal.service';
import { LocalStorageService } from 'ngx-webstorage';
import { HomeComponent } from './home.component';

describe(`HomeComponent`, () => {
  let comp: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: MockAuth;
  let activatedRoute: ActivatedRouteStub;
  let location: SpyLocation;

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

    constructor() {}

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

  // synchronous beforeEach
  beforeEach(() => {
    activatedRoute.testParams = { status: 'approved' };
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(HomeComponent);
    comp = fixture.componentInstance;
    authService = TestBed.get(Auth);

    fixture.detectChanges(); // trigger initial data binding
  });

  it('ngOnInit should check user authentication state', () => {
    spyOn(authService, 'isAuthenticated');
    authService.authenticated = true;
    comp.ngOnInit();
    expect(authService.isAuthenticated).toHaveBeenCalled();
  });

  it('ngOnInit should check if authenticated user has role', () => {
    spyOn(authService, 'checkUserHasRole');
    authService.authenticated = true;
    comp.ngOnInit();
    expect(authService.checkUserHasRole).toHaveBeenCalled();
  });
});
