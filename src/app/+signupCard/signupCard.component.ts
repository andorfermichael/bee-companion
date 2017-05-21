import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';
import { Router } from '@angular/router';

import { Auth } from '../@services/auth.service';

@Component({
  selector: 'signupCard',
  styleUrls: [ './signupCard.component.scss' ],
  templateUrl: './signupCard.component.html',
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

export class SignupCardComponent {
  public static setFocus(elementRef) {
    elementRef.nativeElement.focus();
  }

  public forgotPassword: boolean;
  public usernameEmpty: string = 'inactive';
  public username2Empty: string = 'inactive';
  public passwordEmpty: string = 'inactive';
  public emailEmpty: string = 'inactive';
  public submitErr: string = 'inactive';
  @ViewChild('username') public usernameElementRef: any;
  @ViewChild('password') public passwordElementRef: any;
  public errorMsg: string;
  public successMsg: string;

  constructor(public auth: Auth, public router: Router) {}

  public resetUsernamePasswordEmtpy() {
    this.usernameEmpty = 'inactive';
    this.username2Empty = 'inactive';
    this.passwordEmpty = 'inactive';
    this.emailEmpty = 'inactive';
    this.submitErr = 'inactive';
  }

  public checkInputs(username?: string, password?: string) {
    this.errorMsg = '';
    this.successMsg = '';
    if (!password) {
      this.passwordEmpty = 'active';
      SignupCardComponent.setFocus(this.passwordElementRef);
      this.errorMsg = 'Password is required!';
    }
    if (!username) {
      this.usernameEmpty = 'active';
      SignupCardComponent.setFocus(this.usernameElementRef);
      this.errorMsg = 'Username is required!';
    }
    if (!username && !password) {
      this.errorMsg = 'Username and password are required!';
    }
    if (username && password) {
      if (username.length < 6 || password.length < 6) {
        this.errorMsg = 'Invalid username or password!';
        return;
      }
      this.auth.login(username, password).then(
        () => {
          this.router.navigate(['/restricted']);
        },
        (error) => {
          console.log(error);
          this.errorMsg = error;
          this.submitErr = 'active';
        });
    }
  }
}
