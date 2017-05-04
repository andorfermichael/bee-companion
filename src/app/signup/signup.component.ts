import {
  Component,
  Input,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';

import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';

import { Auth } from '../auth.service';
import { Router } from '@angular/router';
import { RequestOptions, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { EventsService } from '../events.service';

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
  @ViewChild('signupCard') public signupCardElementRef;
  public extErrorMessage: string;

  constructor(public auth: Auth, public router: Router,
              public authHttp: AuthHttp, public _eventsService: EventsService) {
  }

  @HostListener('document:click', ['$event'])
  public onClick(event) {
    if (!this.signupCardElementRef.nativeElement.contains(event.target)) {
      this.extErrorMessage = 'Please complete your signup first :)';
      return false;
    }
  }

  public addUserRole(role) {
    this._eventsService.broadcast('loginStart');

    this.authHttp.get('http://localhost:3000/auth/api/user/set/role/' + role)
      .subscribe(
        (data) => {
          this._eventsService.broadcast('loginSuccess');
          this.auth._updateProfile(); },
        (err) => {
          this._eventsService.broadcast('loginFail');
          console.log(err); });
  }
}
