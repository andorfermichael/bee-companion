import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthHttp} from 'angular2-jwt';

// Load the implementations that should be tested
import { Auth } from '../../../@services/auth.service';
import { EventsService } from '../../../@services/events.service';
import { SignupPageComponent } from '../../../@pages/signup/signup.component';

import { MockAuthService, MockAuthHttp } from '../_doubles/auth.doubles'

describe(`SignupPageComponent`, () => {
  let comp: SignupPageComponent;
  let fixture: ComponentFixture<SignupPageComponent>;
  let eventsService: EventsService;
  let authService: Auth;

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
        { provide: Auth, useClass: MockAuthService },
        { provide: AuthHttp, useClass: MockAuthHttp },
      ]
    })
    .compileComponents() // compile template and css
  }));

  describe(`successful signup/login`, () => {
    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(SignupPageComponent);
      comp = fixture.componentInstance;
      eventsService = TestBed.get(EventsService);
      authService = TestBed.get(Auth);
    });

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

  describe(`failed signup/login`, () => {
    it('addUserRole should log error on failed auth api call', () => {
      spyOn(console, 'error');
      comp.addUserRole('Error');
      expect(console.error).toHaveBeenCalled();
    });
  });
});

