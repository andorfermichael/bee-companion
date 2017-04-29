import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  trigger, state, animate, transition, keyframes, style
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router }   from '@angular/router';
import { Auth } from '../auth.service';
import { LoginError } from '../login.error.service';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Nav` component loaded asynchronously');

@Component({
  selector: 'nav-bar',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './nav.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './nav.component.html',
  host: {
    '(document:click)': 'onClick($event)',
  },
  animations: [
    trigger('loginClickedState', [
      state('inactive', style({
        display: 'none',
        transform: 'translateX(120%)'
      })),
      state('active',   style({
        display: 'flex',
        transform: 'translateX(0%)'
      })),
      transition('inactive => active', animate('.25s ease-in')),
      transition('active => inactive', animate('.25s ease-out'))
    ]),
    trigger('loginButtonsState', [
      state('inactive', style({
        display: 'none',
        transform: 'translateX(-50%)',
        opacity: '0'
      })),
      state('active',   style({
        display: 'flex',
        transform: 'translateX(0%)',
        opacity: '1'
      })),
      transition('inactive => active', animate('.125s ease-in')),
      transition('active => inactive', animate('.125s ease-out'))
    ]),
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


export class NavComponent implements OnInit {
  constructor(private elemRef: ElementRef, private sanitizer: DomSanitizer, private auth: Auth, private router: Router, private _loginError: LoginError) { }


  onClick(event) {
   if (!this.elemRef.nativeElement.contains(event.target) && this.loginClicked) {
    this.clickedLogin()
   }
  }

  onMouseOver(event) {
    if (!this.transitionInProgress) {
      this.transitionInProgress = true
      this.createGradientTransition(this.getOffsetLeft(event.srcElement))
    }
  }

  onMouseLeave(event) {
    this.gradientBarBackground = ""
  }

  loginClicked = false
  loginInputs = 'inactive'
  loginButtons = 'active'
  gradientBarBackground
  lastPosition = 0
  transitionInProgress = false
  usernameEmpty = 'inactive'
  passwordEmpty = 'inactive'
  @ViewChild('username') usernameElementRef
  @ViewChild('password') passwordElementRef
  @Input() disableInlineLogin: boolean
  errorMsg: string

  createGradientTransition(to) {
    if (this.lastPosition < to) {
      if (to - this.lastPosition < 10) {
        this.createGradient(to)
        this.transitionInProgress = false
        return
      }
      this.lastPosition += 10
      setTimeout(() => {
        this.createGradient(this.lastPosition)
        this.createGradientTransition(to)
      }, 1 )
    } else if (this.lastPosition > to) {
      if (this.lastPosition - to < 10) {
        this.createGradient(to)
        this.transitionInProgress = false
        return
      }
      this.lastPosition -= 10
      setTimeout(() => {
        this.createGradient(this.lastPosition)
        this.createGradientTransition(to)
      }, 1 )
    } else {
      this.transitionInProgress = false
    }
  }

  resetUsernamePasswordEmtpy() {
    this.usernameEmpty = 'inactive';
    this.passwordEmpty = 'inactive';
  }

  checkInputs(username?: string, password?: string) {
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
      // this.auth.login(username, password, this.redirectToFullLogin)
      this.auth.login(username, password).then(
        (data) => this.onLoginSuccess(data),
        (error) => this.onLoginError(error, username));
    }
  }

  private onLoginError(err, username) {
    console.log("### ERROR ON LOGIN###")
    console.log(err)
    this._loginError.errorMessage = err
    this._loginError.enteredUsername = username
    this.router.navigate(['/login'])
  }

  private onLoginSuccess(data) {
    console.log("### SUCCESS ON LOGIN###")
    console.log(data)
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

  createGradient(position) {
    const gradient = 'linear-gradient(to right, #292b2c ' + (position-80) + 'px, #f6dd3b ' + (position) + 'px, #292b2c ' + (position + 80) + 'px)'
    this.gradientBarBackground = this.sanitizer.bypassSecurityTrustStyle(gradient);
  }

  getOffsetLeft(element) {
    return (element.offsetWidth/2) + element.offsetLeft + ( element.offsetParent ? element.offsetParent.offsetLeft : 0 )
  }

  public ngOnInit() {
    console.log('hello `Nav` component');
  }

  public clickedLogin() {
      this.loginInputs = !this.loginClicked ? 'active' : 'inactive'
      if (this.loginClicked) {
        setTimeout(() => {
          this.loginClicked = !this.loginClicked
          this.loginButtons = !this.loginClicked ? 'active' : 'inactive'
        }, 250)
      } else {
        this.loginButtons = this.loginClicked ? 'active' : 'inactive'
        setTimeout(() => {
          this.loginClicked = !this.loginClicked
        }, 250)
      }
      
  }

}
