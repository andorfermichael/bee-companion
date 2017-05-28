import { Component } from '@angular/core';

import { Auth } from '../../@services/auth.service';

@Component({
  template: ``
})
export class CallbackComponent {
  constructor(public authService: Auth) {
    this.authService.handleAuth();
  }
}
