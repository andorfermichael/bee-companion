import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  trigger, state, animate, transition, keyframes, style
} from '@angular/core';

import { Auth } from '../auth.service';
import { Router }   from '@angular/router';

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

export class SignupCardComponent implements OnInit {

  constructor(
    private auth: Auth,
    private elemRef: ElementRef, 
    public router: Router
  ) {}

  @Input() activeTab: '"logIn" || "signUp"'
  supporterActive: boolean
  signupActive: boolean
  forgotPassword: boolean
  usernameEmpty = 'inactive'
  username2Empty = 'inactive'
  passwordEmpty = 'inactive'
  emailEmpty = 'inactive'
  submitErr = 'inactive'
  @ViewChild('username') usernameElementRef
  @ViewChild('username2') username2ElementRef
  @ViewChild('password') passwordElementRef
  @ViewChild('email') emailElementRef
  errorMsg: string
  successMsg: string

  resetUsernamePasswordEmtpy() {
    this.usernameEmpty = 'inactive';
    this.username2Empty = 'inactive';
    this.passwordEmpty = 'inactive';
    this.emailEmpty = 'inactive';
    this.submitErr = 'inactive';
  }

  checkInputs(username?: string, password?: string) {
    this.errorMsg = ''
    this.successMsg = ''
    if (!password) {
      this.passwordEmpty = 'active';
      this.setFocus(this.passwordElementRef)
      this.errorMsg = 'Password is required!'
    }
    if (!username) {
      this.usernameEmpty = 'active';
      this.setFocus(this.usernameElementRef)
      this.errorMsg = 'Username is required!'
    }
    if (!username && !password) {
      this.errorMsg = 'Username and password are required!'
    }
    if (username && password) {
      if (username.length < 6 || password.length < 6) {
        this.errorMsg = 'Invalid username or password!'
        return
      }
      this.auth.login(username, password).then(
        (data) => { this.router.navigate(['/restricted']) },
        (error) => { console.log(error); this.errorMsg = error; this.submitErr = 'active' })
    }
  }

  checkForgotPasswordInputs(username?: string, email?: string) {
    this.errorMsg = ''
    this.successMsg = ''
    if (!username && !email) {
       this.usernameEmpty = 'active'
       this.username2Empty = 'active'
       this.emailEmpty = 'active'
       this.setFocus(this.usernameElementRef)
       this.errorMsg = 'Username or email-address are necessary!'
    } else {
      this.auth.forgotPassword(username, email).then(
      (data) => {
        this.successMsg = data
        this.forgotPassword = false },
      (error) => {
        this.errorMsg = error
        this.forgotPassword = false
      })
    }
  }

  setFocus(elementRef) {
    elementRef.nativeElement.focus();
  }

  toggleForgotPassword(toggleTo:boolean) {
    if (toggleTo === undefined) toggleTo = !this.forgotPassword
      this.forgotPassword = toggleTo
    this.resetUsernamePasswordEmtpy()
    this.errorMsg = ''
  }

  public ngOnInit() {}

  public ngAfterViewInit() {}
  
}
