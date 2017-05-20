import { Component } from '@angular/core';
import { Auth } from '../@services/auth.service';

@Component({
  template: ``
})
export class CallbackComponent {
  constructor(private authService: Auth) {
    this.authService.handleAuth();
  }
}
