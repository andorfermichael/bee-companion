import { Component, OnInit } from '@angular/core';

import { Auth } from '../../@services/auth.service';

@Component({
  selector: 'restricted',
  styleUrls: [ './restricted.component.scss' ],
  templateUrl: './restricted.component.html'
})
export class RestrictedComponent implements OnInit {
  constructor(public auth: Auth) {}

  public ngOnInit() {
    console.log(this.auth.userProfile);
  }
}
