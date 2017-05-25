import { TestBed, async } from '@angular/core/testing';
import { Router } from "@angular/router";

import { NonAuthGuard } from '../../../@services/non-auth-guard.service';
import { Auth } from '../../../@services/auth.service';


describe('NonAuthGuardService', () => {
  let nonAuthGuardService: NonAuthGuard;
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
        NonAuthGuard,
        { provide: Auth, useClass: MockAuth },
        { provide: Router, useValue: router }
      ]
    });

    router.navigate = jasmine.createSpy('navigate');
  }));

  beforeEach(() => {
    nonAuthGuardService = TestBed.get(NonAuthGuard);
    authService = TestBed.get(Auth);
  });

  it('canActivate should navigate to homepage if authenticated', () => {
    authService.authenticated = true;
    expect(nonAuthGuardService.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('canActivate should let user visit page (should not navigate) if not authenticated', () => {
    authService.authenticated = false;
    expect(nonAuthGuardService.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
