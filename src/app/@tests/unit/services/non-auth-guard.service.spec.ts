import { TestBed, async } from '@angular/core/testing';
import { Router } from "@angular/router";

import { NonAuthGuard } from '../../../@services/non-auth-guard.service';
import { Auth } from '../../../@services/auth.service';

import { MockAuthService } from '../_doubles/auth.doubles'
import { MockRouter } from '../_doubles/router.doubles'

describe('NonAuthGuardService', () => {
  let nonAuthGuardService: NonAuthGuard;
  let authService: MockAuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        NonAuthGuard,
        { provide: Auth, useClass: MockAuthService },
        { provide: Router, useValue: MockRouter }
      ]
    });

    MockRouter.navigate = jasmine.createSpy('navigate');
  }));

  beforeEach(() => {
    nonAuthGuardService = TestBed.get(NonAuthGuard);
    authService = TestBed.get(Auth);
  });

  it('canActivate should navigate to homepage if authenticated', () => {
    authService.authenticated = true;
    expect(nonAuthGuardService.canActivate()).toBe(false);
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('canActivate should let user visit page (should not navigate) if not authenticated', () => {
    authService.authenticated = false;
    expect(nonAuthGuardService.canActivate()).toBe(true);
    expect(MockRouter.navigate).not.toHaveBeenCalled();
  });
});
