import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  trigger, state, animate, transition, keyframes, style
} from '@angular/core';

import { Auth } from '../auth.service';
import { Router } from '@angular/router';

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

  @Input() public activeTab: '"logIn" || "signUp"';
  public supporterActive: boolean;
  public signupActive: boolean;
  public forgotPassword: boolean;
  public usernameEmpty = 'inactive';
  public username2Empty = 'inactive';
  public passwordEmpty = 'inactive';
  public emailEmpty = 'inactive';
  public submitErr = 'inactive';
  @ViewChild('username') public usernameElementRef;
  @ViewChild('username2') public username2ElementRef;
  @ViewChild('password') public passwordElementRef;
  @ViewChild('email') public emailElementRef;
  public errorMsg: string;
  public successMsg: string;

  constructor(
    public auth: Auth,
    public elemRef: ElementRef,
    public router: Router
  ) {}

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
      this.setFocus(this.passwordElementRef);
      this.errorMsg = 'Password is required!';
    }
    if (!username) {
      this.usernameEmpty = 'active';
      this.setFocus(this.usernameElementRef);
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
        (data) => { this.router.navigate(['/restricted']); },
        (error) => { console.log(error); this.errorMsg = error; this.submitErr = 'active'; });
    }
  }

  public checkForgotPasswordInputs(username?: string, email?: string) {
    this.errorMsg = '';
    this.successMsg = '';
    if (!username && !email) {
       this.usernameEmpty = 'active';
       this.username2Empty = 'active';
       this.emailEmpty = 'active';
       this.setFocus(this.usernameElementRef);
       this.errorMsg = 'Username or email-address are necessary!';
    } else {
      this.auth.forgotPassword(username, email).then(
      (data) => {
        this.successMsg = data;
        this.forgotPassword = false; },
      (error) => {
        this.errorMsg = error;
        this.forgotPassword = false;
      });
    }
  }

  public setFocus(elementRef) {
    elementRef.nativeElement.focus();
  }

  public toggleForgotPassword(toggleTo: boolean) {
    if (toggleTo === undefined) {
      toggleTo = !this.forgotPassword;
    }
    this.forgotPassword = toggleTo;
    this.resetUsernamePasswordEmtpy();
    this.errorMsg = '';
  }

}
