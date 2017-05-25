import { TestBed, async } from '@angular/core/testing';
import { Router } from "@angular/router";

import { AuthGuard } from '../../../@services/auth-guard.service';
import { Auth } from '../../../@services/auth.service';

import { MockAuthService } from '../_doubles/auth.doubles'
import { MockRouter } from '../_doubles/router.doubles'

describe('AuthGuardService', () => {
  let authGuardService: AuthGuard;
  let authService: MockAuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Auth, useClass: MockAuthService },
        { provide: Router, useValue: MockRouter }
      ]
    });

    MockRouter.navigate = jasmine.createSpy('navigate');
  }));

  beforeEach(() => {
    authGuardService = TestBed.get(AuthGuard);
    authService = TestBed.get(Auth);
  });

  it('canActivate should navigate to homepage if not authenticated', () => {
    authService.authenticated = false;
    expect(authGuardService.canActivate()).toBe(false);
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('canActivate should let user visit page (should not navigate) if authenticated', () => {
    authService.authenticated = true;
    expect(authGuardService.canActivate()).toBe(true);
    expect(MockRouter.navigate).not.toHaveBeenCalled();
  });
});
