import { Component } from '@angular/core';
import { Auth } from '../auth.service';

@Component({
  template: ``
})
export class CallbackComponent {
  constructor(private authService: Auth) {
    this.authService.handleAuth();
  }
}
