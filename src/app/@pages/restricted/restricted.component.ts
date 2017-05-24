import { Component, OnInit } from '@angular/core';

import { Auth } from '../../@services/auth.service';

@Component({
  selector: 'restricted',
  styleUrls: [ './restricted.component.scss' ],
  templateUrl: './restricted.component.html'
})
export class RestrictedComponent {
  constructor( public auth: Auth ) {}
}
