import { TestBed, async } from '@angular/core/testing';
import { Router } from "@angular/router";

import { AuthRoleGuard } from '../../../@services/auth-role-guard.service';
import { Auth } from '../../../@services/auth.service';

import { MockAuthService } from '../_doubles/auth.doubles'
import { MockRouter } from '../_doubles/router.doubles'

describe('AuthRoleGuardService', () => {
  let authRoleGuardService: AuthRoleGuard;
  let authService: MockAuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthRoleGuard,
        { provide: Auth, useClass: MockAuthService },
        { provide: Router, useValue: MockRouter }
      ]
    });

    MockRouter.navigate = jasmine.createSpy('navigate');
  }));

  beforeEach(() => {
    authRoleGuardService = TestBed.get(AuthRoleGuard);
    authService = TestBed.get(Auth);
  });

  it('canActivate should navigate to homepage if not authenticated', () => {
    authService.authenticated = false;
    authService.hasUserRole = false;
    authService.userProfile = {role: 'Beekeeper'};
    expect(authRoleGuardService.canActivate()).toBe(false);
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('canActivate should navigate to "signup/complete if authenticated but no user role was defined', () => {
    authService.authenticated = true;
    authService.hasUserRole = false;
    authService.userProfile = {role: 'Beekeeper'};
    expect(authRoleGuardService.canActivate()).toBe(false);
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/signup/complete']);
  });

  it('canActivate should let user visit page (should not navigate) if authenticated and user role defined', () => {
    authService.authenticated = true;
    authService.hasUserRole = true;
    authService.userProfile = {role: 'Beekeeper'};
    expect(authRoleGuardService.canActivate()).toBe(true);
    expect(MockRouter.navigate).not.toHaveBeenCalled();
  });
});
