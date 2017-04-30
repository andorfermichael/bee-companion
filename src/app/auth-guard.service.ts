import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
// Import our authentication service
import { Auth } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate() {
    // If user is not logged in we'll send them to the homepage 
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    } else if (!this.auth.checkUserHasRole()) {
    	this.router.navigate(['/signup/complete']);
    	return false;
    }
    return true;
  }

}