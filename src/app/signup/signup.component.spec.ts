import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {BaseRequestOptions, ConnectionBackend, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {AuthHttp} from 'angular2-jwt';

// Load the implementations that should be tested
import { Auth } from '../@services/auth.service';
import { EventsService } from '../@services/events.service';
import { SignupPageComponent } from './signup.component';
import {Observable} from "rxjs/Observable";

describe(`SignupPageComponent`, () => {
  let comp: SignupPageComponent;
  let fixture: ComponentFixture<SignupPageComponent>;
  let eventsService: EventsService;
  let authHttp: MockAuthHttp;
  let authService: Auth;
  let backend: MockBackend;

  class MockAuth {
    public _updateProfile() {
      return true;
    }
  }

  class MockAuthHttp {
    get(url: string): Observable<any> {
      return Observable.of({});
    }
  }

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'signup/complete', component: SignupPageComponent }])],
      declarations: [SignupPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        AuthHttp,
        EventsService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Auth, useClass: MockAuth },
        { provide: AuthHttp, useClass: MockAuthHttp },
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(SignupPageComponent);
      comp = fixture.componentInstance;
    }); // compile template and css
  }));

  describe(`successfull signup/login`, () => {
    // synchronous beforeEach
    beforeEach(inject([MockBackend], (mockBackend: MockBackend) => {
      fixture = TestBed.createComponent(SignupPageComponent);
      comp = fixture.componentInstance;
      eventsService = TestBed.get(EventsService);
      authHttp = TestBed.get(AuthHttp);
      authService = TestBed.get(Auth);
      backend = mockBackend;
    }));

    it('addUserRole should force event service to broadcast "loginStart"', () => {
      spyOn(eventsService, 'broadcast');
      comp.addUserRole('Beekeeper');
      expect(eventsService.broadcast).toHaveBeenCalledWith('loginStart');
    });

    it('addUserRole should force event service to broadcast "loginSuccess" on successful auth api call', () => {
      spyOn(eventsService, 'broadcast');
      comp.addUserRole('Beekeeper');
      expect(eventsService.broadcast).toHaveBeenCalledWith('loginSuccess');
    });

    it('addUserRole should call update profile using auth service on successful auth api call', () => {
      spyOn(authService, '_updateProfile');
      comp.addUserRole('Beekeeper');
      expect(authService._updateProfile).toHaveBeenCalled();
    });
  });
});

