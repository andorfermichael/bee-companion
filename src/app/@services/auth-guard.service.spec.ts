import { TestBed, async } from '@angular/core/testing';
import { Router } from "@angular/router";

import { AuthGuard } from './auth-guard.service';
import { Auth } from '../@services/auth.service';


describe('AuthGuardService', () => {
  let authGuardService: AuthGuard;
  let authService: MockAuth;

  let router = {
    navigate: jasmine.createSpy('navigate')
  };

  class MockAuth {
    public authenticated: boolean;

    public isAuthenticated(): boolean {
      return this.authenticated;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Auth, useClass: MockAuth },
        { provide: Router, useValue: router }
      ]
    });

    router.navigate = jasmine.createSpy('navigate');
  }));

  beforeEach(() => {
    authGuardService = TestBed.get(AuthGuard);
    authService = TestBed.get(Auth);
  });

  it('canActivate should navigate to homepage if not authenticated', () => {
    authService.authenticated = false;
    expect(authGuardService.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('canActivate should let user visit page (should not navigate) if authenticated', () => {
    authService.authenticated = true;
    expect(authGuardService.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
