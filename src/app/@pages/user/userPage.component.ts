import { Component, OnInit } from '@angular/core';

import { Auth } from '../../@services/auth.service';

@Component({
  selector: 'user-page',
  styleUrls: [ './userPage.component.scss' ],
  templateUrl: './userPage.component.html'
})
export class UserPageComponent {
  constructor( public auth: Auth ) {}
}
