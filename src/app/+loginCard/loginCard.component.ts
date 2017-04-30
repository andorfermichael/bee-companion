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
import { EventsService } from '../events.service';

@Component({
  selector: 'loginCard',
  styleUrls: [ './loginCard.component.scss' ],
  templateUrl: './loginCard.component.html',
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

export class LoginCardComponent implements OnInit {

  constructor(
    private auth: Auth,
    private elemRef: ElementRef, 
    public router: Router,
    public _eventsService: EventsService
  ) {}

  @Input() activeTab: '"logIn" || "signUp"'

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

  loginWithSocial(type: string) {
    this._eventsService.broadcast('loginStart')
    if (type.toLowerCase() === 'facebook')
      this.auth.loginWithFacebook()
    if (type.toLowerCase() === 'google')
      this.auth.loginWithGoogle()
    return false
  }  

  loginWithFacebook() {
    this._eventsService.broadcast('loginStart')
    this.auth.loginWithGoogle()
    return false
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
      if (username.length < 4 || password.length < 4) {
        this.errorMsg = 'Invalid username or password!'
        return
      }
      this._eventsService.broadcast('loginStart');
      this.auth.login(username, password).then(
        (data) => { 
          this._eventsService.broadcast('loginSuccess');
          this.router.navigate(['/restricted']) 
        },
        (error) => { 
          this._eventsService.broadcast('loginFail',error, {username: username, password: password});
          this.onLoginFail(error) 
        })
    }
  }

  onLoginFail(error): void {
    this.errorMsg = error
    this.submitErr = 'active'
    this.usernameEmpty = 'active'
    this.passwordEmpty = 'active' 
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
        this.forgotPassword = false
      },
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

  restoreFields(data:any) {
    this.usernameElementRef.nativeElement.value = data.username
    this.setFocus(this.passwordElementRef)
  }

  public ngOnInit() {
    this._eventsService.on('loginFail', (err, data) => {
      this.onLoginFail(err)
      this.restoreFields(data)
    })
  }

  public ngAfterViewInit() { }
}
