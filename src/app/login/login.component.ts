import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  trigger, state, animate, transition, keyframes, style
} from '@angular/core';

import { AppState } from '../app.service';
import { NavComponent } from '../+nav';
import { Auth } from '../auth.service';
import { Router }   from '@angular/router';
import { LoginError } from '../login.error.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'loginPage'
  selector: 'loginPage',  // <loginPage></loginPage>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  // providers: [
  //  Title
  // ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './login.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './login.component.html',
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

export class LoginPageComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    private auth: Auth,
    private elemRef: ElementRef, 
    public router: Router,
    private _loginError: LoginError
    //public title: Title
  ) {}

  @Input() activeTab: '"logIn" || "signUp"'
  loginActive: boolean
  signupActive: boolean
  forgotPassword: boolean
  usernameEmpty = 'inactive'
  username2Empty = 'inactive'
  passwordEmpty = 'inactive'
  emailEmpty = 'inactive'
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
        (error) => { console.log(error); this.errorMsg = error })
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

  redirectToFullLogin = (err) => {
    if (err) {
      this.router.navigate(['/login', {
        errorMsg: err.description
      }])
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

  public ngOnInit() {
    console.log('hello `loginPage` component');
    console.log('test123123123')
    console.log(this._loginError.errorMessage)
    if (this._loginError.errorMessage) {
      console.log(this._loginError.errorMessage)
      this.errorMsg = this._loginError.errorMessage
      this._loginError.errorMessage = undefined
      this.passwordEmpty = 'active'
    }
    // this.title.getData().subscribe(data => this.data = data);
  }

  public ngAfterViewInit() {
    if (this._loginError.enteredUsername) {
      this.usernameElementRef.nativeElement.value = this._loginError.enteredUsername
      this._loginError.enteredUsername = undefined
      this.setFocus(this.passwordElementRef)
    }
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
