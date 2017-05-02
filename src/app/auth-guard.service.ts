import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { Auth } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  public canActivate(): boolean {
    // If user is not logged in we'll send them to the homepage
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
