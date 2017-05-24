import { Component } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';
import { Router } from '@angular/router';

import { AuthHttp } from 'angular2-jwt';

import { Auth } from '../@services/auth.service';
import { EventsService } from '../@services/events.service';

@Component({
  selector: 'signupPage',
  styleUrls: [ './signup.component.scss' ],
  templateUrl: './signup.component.html',
  animations: [
    trigger('fieldRequired', [
      state('inactive', style({
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      })),
      transition('inactive => active', [
        animate(300, keyframes([
          style({transform: 'translate3d(-1px, 0, 0)', borderColor: '#f6dd3b'}),
          style({transform: 'translate3d(2px, 0, 0)'}),
          style({transform: 'translate3d(-4px, 0, 0)'}),
          style({transform: 'translate3d(4px, 0, 0)'})
        ]))
      ]),
      transition('active => inactive', [
        animate(300, keyframes([
          style({transform: 'translate3d(4px, 0, 0)'}),
          style({transform: 'translate3d(-4px, 0, 0)'}),
          style({transform: 'translate3d(2px, 0, 0)'}),
          style({transform: 'translate3d(-1px, 0, 0)', borderColor: 'initial'})
        ]))
      ])
    ])
  ]
})

export class SignupPageComponent {
  public extErrorMessage: string;

  constructor(public auth: Auth, public router: Router,
              public authHttp: AuthHttp, public _eventsService: EventsService) {
  }

  public addUserRole(role) {
    this._eventsService.broadcast('loginStart');

    this.authHttp.get('http://localhost:3000/api/auth/user/set/role/' + role)
      .subscribe(
        () => {
          this._eventsService.broadcast('loginSuccess');
          this.auth._updateProfile(); },
        (err) => {
          this._eventsService.broadcast('loginFail');
          console.error(err); });
  }
}
