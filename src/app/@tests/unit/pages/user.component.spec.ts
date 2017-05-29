import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthConfig, AuthHttp } from 'angular2-jwt';
import { BaseRequestOptions, ConnectionBackend, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { encodeTestToken } from 'angular2-jwt/angular2-jwt-test-helpers';


import { Auth } from '../../../@services/auth.service';
import { UserPageComponent } from '../../../@pages/user/userPage.component';

import { MockAuthService } from '../_doubles/auth.doubles';
import {ActivatedRouteStub, MockRouter} from '../_doubles/router.doubles';
describe(`UserPageComponent`, () => {
  let comp: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let titleService: Title;
  let activatedRoute: ActivatedRouteStub;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule],
      declarations: [UserPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title,
        {
          provide: AuthHttp,
          useFactory: (http) => {
            return new AuthHttp(new AuthConfig({
              tokenName: 'token',
              tokenGetter: (() => encodeTestToken(this)),
              globalHeaders: [{'Content-Type': 'application/json'}]
            }), http);
          },
          deps: [Http]
        },
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AuthHttp,
          useExisting: Http,
          deps: [Http]
        },
        BaseRequestOptions,
        { provide: Auth, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: MockRouter }
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    comp = fixture.componentInstance;
    titleService = TestBed.get(Title);
  });

  xit('ngOnInit should set page title', () => {
    spyOn(titleService, 'setTitle');
    comp.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalled();
  });
});
