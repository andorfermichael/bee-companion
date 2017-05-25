import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { Auth } from '../@services/auth.service';
import Auth0 from 'auth0-js';

import { myConfig } from '../@config/auth.config';

describe(`LoginCardComponent`, () => {
  let authService: Auth;
  let auth0WebAuth: MockAuth0WebAuth;

  class MockAuth0WebAuth {
    public authorize({connection, redirect_uri}: any) {
      return;
    }
  }

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [authService],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Auth0.WebAuth, useClass: MockAuth0WebAuth }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    authService = TestBed.get(Auth);
    auth0WebAuth = TestBed.get(Auth0.WebAuth)
  });

  xit('ddf', () => {
    spyOn(auth0WebAuth, 'authorize');
    authService.loginWithGoogle();
    expect(auth0WebAuth.authorize).toHaveBeenCalledWith({connection: 'google-oauth2', redirect_uri: myConfig.redirectUri});
  });
});

