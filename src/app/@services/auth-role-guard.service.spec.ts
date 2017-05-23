import { TestBed, async } from '@angular/core/testing';
import { Router } from "@angular/router";

import { AuthRoleGuard } from './auth-role-guard.service';
import { Auth } from '../@services/auth.service';


describe('AuthRoleGuardService', () => {
  let authRoleGuardService: AuthRoleGuard;
  let authService: MockAuth;

  let router = {
    navigate: jasmine.createSpy('navigate')
  };

  class MockAuth {
    public authenticated: boolean;
    public userRole: boolean;

    public isAuthenticated(): boolean {
      return this.authenticated;
    }

    public checkUserHasRole(): boolean {
      return this.userRole;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthRoleGuard,
        { provide: Auth, useClass: MockAuth },
        { provide: Router, useValue: router }
      ]
    });

    router.navigate = jasmine.createSpy('navigate');
  }));

  beforeEach(() => {
    authRoleGuardService = TestBed.get(AuthRoleGuard);
    authService = TestBed.get(Auth);
  });

  it('canActivate should navigate to homepage if not authenticated', () => {
    authService.authenticated = false;
    authService.userRole = false;
    expect(authRoleGuardService.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('canActivate should navigate to "signup/complete if authenticated but no user role was defined', () => {
    authService.authenticated = true;
    authService.userRole = false;
    expect(authRoleGuardService.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/signup/complete']);
  });

  it('canActivate should let user visit page (should not navigate) if authenticated and user role defined', () => {
    authService.authenticated = true;
    authService.userRole = true;
    expect(authRoleGuardService.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
