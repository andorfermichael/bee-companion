import { Directive, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockBackend } from '@angular/http/testing';
import { AuthHttp} from 'angular2-jwt';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

// Load the implementations that should be tested
import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';
import { NavComponent } from './nav.component';

describe(`NavComponent`, () => {
  let comp: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let eventsService: EventsService;
  let authService: Auth;
  let sanitizer: DomSanitizer;

  class MockAuth {
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

  @Directive({
    selector: '[routerLink], [routerLinkActive], [routerLinkActiveOptions]'
  })
  class DummyRouterLinkDirective {}

  let router = {
    navigate: jasmine.createSpy('navigate')
  };

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [NavComponent, DummyRouterLinkDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        DomSanitizer,
        AuthHttp,
        EventsService,
        BaseRequestOptions,
        LocalStorageService,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Auth, useClass: MockAuth },
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    comp = fixture.componentInstance;
    eventsService = TestBed.get(EventsService);
    authService = TestBed.get(Auth);
    sanitizer = TestBed.get(DomSanitizer);
  });

  describe(`helper methods`, () => {
    it('resetUsernamePasswordEmpty should set username and password to empty ', () => {
      comp.resetUsernamePasswordEmpty();
      expect(comp.usernameEmpty).toEqual('inactive');
      expect(comp.passwordEmpty).toEqual('inactive');
    });

    it('checkInputs should set "passwordEmpty" to active, set focus on password element and set error message to "Password is required!" if no password passed to', () => {
      comp.passwordEmpty = 'inactive';
      comp.errorMsg = '';
      spyOn(NavComponent, 'setFocus');
      comp.checkInputs('Michael', null);
      expect(comp.passwordEmpty).toEqual('active');
      expect(NavComponent.setFocus).toHaveBeenCalledWith(comp.passwordElementRef);
      expect(comp.errorMsg).toEqual('Password is required!');
    });

    it('checkInputs should set "usernameEmpty" to active, set focus on username element and set error message to "Username is required!" if no username passed to', () => {
      comp.usernameEmpty = 'inactive';
      comp.errorMsg = '';
      spyOn(NavComponent, 'setFocus');
      comp.checkInputs(null, 'Password');
      expect(comp.usernameEmpty).toEqual('active');
      expect(NavComponent.setFocus).toHaveBeenCalledWith(comp.usernameElementRef);
      expect(comp.errorMsg).toEqual('Username is required!');
    });

    xit('checkInputs should set error message to "Invalid username or password!" if password and/or username are less than 4 characters', () => {
      comp.checkInputs('Usr', 'Pwd');
      expect(comp.errorMsg).toEqual('Invalid username or password!');
    });

    it('checkInputs should send "loginStart" broadcast via event services if password and username passed validation', () => {
      spyOn(eventsService, 'broadcast');
      comp.checkInputs('Michael', 'Password');
      expect(eventsService.broadcast).toHaveBeenCalledWith('loginStart');
    });

    it('createGradient should calculate linear gradient based on given position', () => {
      const position = 0;
      comp.createGradient(position);
      expect(comp.gradientBarBackground).toEqual(sanitizer.bypassSecurityTrustStyle('linear-gradient(to right, #292b2c ' + (position - 80) +
        'px, #f6dd3b ' + (position) + 'px, #292b2c ' + (position + 80) + 'px)'));
    });
  });

  describe(`lifecycle methods`, () => {
    it('ngOnInit should force subscribe on event listener "loginStart", "loginSuccess" and "loginFail"', () => {
      spyOn(eventsService, 'on');
      comp.ngOnInit();
      expect((eventsService.on as any).calls.argsFor(0)).toEqual(['loginStart', jasmine.any(Function)]);
      expect((eventsService.on as any).calls.argsFor(1)).toEqual(['loginSuccess', jasmine.any(Function)]);
      expect((eventsService.on as any).calls.argsFor(2)).toEqual(['loginFail', jasmine.any(Function)]);
    });
  });
});

