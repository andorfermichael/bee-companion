import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { Auth } from './auth.service';

@Injectable()
export class NonAuthGuard implements CanActivate {
  constructor(public auth: Auth, public router: Router) {}

  public canActivate(): boolean {
    // If user is logged in we'll send him back to the homepage
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
