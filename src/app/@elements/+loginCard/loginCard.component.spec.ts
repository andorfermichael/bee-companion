import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthHttp} from 'angular2-jwt';

// Load the implementations that should be tested
import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { LoginCardComponent } from './loginCard.component';

describe(`LoginCardComponent`, () => {
  let comp: LoginCardComponent;
  let fixture: ComponentFixture<LoginCardComponent>;
  let eventsService: EventsService;
  let authService: Auth;

  class MockAuth {
    public _updateProfile() {
      return true;
    }

    public loginWithGoogle(): void {
      return;
    }

    public loginWithFacebook(): void {
      return;
    }

    public login(username?: string, password?: string): Promise<any> {
      if (!username && !password) {
        return;
      }
      return this.processLogin(username, password);
    }

    private processLogin(username?: string, password?: string): Promise<any> {
      if (username == 'reject') {
        return Promise.reject('error');
      } else {
        return Promise.resolve();
      }
    }
  }

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule],
      declarations: [LoginCardComponent],
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
        { provide: Auth, useClass: MockAuth }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCardComponent);
    comp = fixture.componentInstance;
    eventsService = TestBed.get(EventsService);
    authService = TestBed.get(Auth);
  });

  describe(`helper methods`, () => {
    it('toggleForgotPassword to true should force username and password reset and forgotPassword to be set true', () => {
      spyOn(comp, 'resetUsernamePasswordEmpty');
      comp.toggleForgotPassword(true);
      expect(comp.resetUsernamePasswordEmpty).toHaveBeenCalled();
      expect(comp.forgotPassword).toEqual(true);
      expect(comp.errorMsg).toEqual('');
    });

    it('restoreFields should set focus on password field', () => {
      spyOn(comp, 'setFocus');
      comp.restoreFields({username: 'John Doe'});
      expect(comp.setFocus).toHaveBeenCalledWith(comp.passwordElementRef);
    });

    it('resetUsernamePasswordEmpty should set username and password to empty ', () => {
      comp.resetUsernamePasswordEmpty();
      expect(comp.usernameEmpty).toEqual('inactive');
      expect(comp.username2Empty).toEqual('inactive');
      expect(comp.passwordEmpty).toEqual('inactive');
      expect(comp.emailEmpty).toEqual('inactive');
      expect(comp.submitErr).toEqual('inactive');
    });

    it('checkInputs should set "passwordEmpty" to active, set focus on password element and set error message to "Password is required!" if no password passed to', () => {
      comp.passwordEmpty = 'inactive';
      comp.errorMsg = '';
      spyOn(comp, 'setFocus');
      comp.checkInputs('Michael', null);
      expect(comp.passwordEmpty).toEqual('active');
      expect(comp.setFocus).toHaveBeenCalledWith(comp.passwordElementRef);
      expect(comp.errorMsg).toEqual('Password is required!');
    });

    it('checkInputs should set "usernameEmpty" to active, set focus on username element and set error message to "Username is required!" if no username passed to', () => {
      comp.usernameEmpty = 'inactive';
      comp.errorMsg = '';
      spyOn(comp, 'setFocus');
      comp.checkInputs(null, 'Password');
      expect(comp.usernameEmpty).toEqual('active');
      expect(comp.setFocus).toHaveBeenCalledWith(comp.usernameElementRef);
      expect(comp.errorMsg).toEqual('Username is required!');
    });

    it('checkInputs should set "usernameEmpty" and "passwordEmpty" to active and set error message to "Username and password are required!" if no username and no password passed to', () => {
      comp.checkInputs(null, null);
      expect(comp.passwordEmpty).toEqual('active');
      expect(comp.usernameEmpty).toEqual('active');
      expect(comp.errorMsg).toEqual('Username and password are required!');
    });

    it('checkInputs should set error message to "Invalid username or password!" if password and/or username are less than 4 characters', () => {
      comp.checkInputs('Usr', 'Pwd');
      expect(comp.errorMsg).toEqual('Invalid username or password!');
    });

    it('checkInputs should send "loginStart" broadcast via event services if password and username passed validation', () => {
      spyOn(eventsService, 'broadcast');
      comp.checkInputs('Michael', 'Password');
      expect(eventsService.broadcast).toHaveBeenCalledWith('loginStart');
    });

    it('checkForgotPasswordInputs should set "usernameEmpty" and "emailEmpty" to active, set focus on username' +
      'element and set error message to "Username or email-address are necessary!" if no username and email passed to', () => {
      spyOn(comp, 'setFocus');
      comp.checkForgotPasswordInputs(null, null);
      expect(comp.usernameEmpty).toEqual('active');
      expect(comp.username2Empty).toEqual('active');
      expect(comp.emailEmpty).toEqual('active');
      expect(comp.setFocus).toHaveBeenCalledWith(comp.usernameElementRef);
      expect(comp.errorMsg).toEqual('Username or email-address are necessary!');
    });
  });

  describe(`lifecycle methods`, () => {
    it('ngOnInit should force subscribe on event listener "loginFail"', () => {
      spyOn(eventsService, 'on');
      comp.ngOnInit();
      expect(eventsService.on).toHaveBeenCalled();
    });

    it('ngOnDestroy should force unsubscribe from event listener "loginFail"', () => {
      spyOn(eventsService, 'off');
      comp.ngOnDestroy();
      expect(eventsService.off).toHaveBeenCalledWith('loginFail');
    });
  });

  describe(`login methods`, () => {
    it('loginWithSocial should send "loginStart" broadcast via event service', () => {
      spyOn(eventsService, 'broadcast');
      comp.loginWithSocial('');
      expect(eventsService.broadcast).toHaveBeenCalledWith('loginStart');
    });

    it('loginWithSocial should return false if wrong provider has been passed to', () => {
      expect(comp.loginWithSocial('')).toEqual(false);
    });

    it('loginWithSocial should call auth service "loginWithFacebook" method when facebook passed to', () => {
      spyOn(authService, 'loginWithFacebook');
      comp.loginWithSocial('facebook');
      expect(authService.loginWithFacebook).toHaveBeenCalled();
    });

    it('loginWithSocial should call auth service "loginWithGoogle" method when google passed to', () => {
      spyOn(authService, 'loginWithGoogle');
      comp.loginWithSocial('google');
      expect(authService.loginWithGoogle).toHaveBeenCalled();
    });
  });
});

