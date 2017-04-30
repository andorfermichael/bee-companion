import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Inject, Injectable,
  trigger, state, animate, transition, keyframes, style
} from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { Router }   from '@angular/router';
import { Auth } from '../auth.service';
import { EventsService } from '../events.service';

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
  constructor(private elemRef: ElementRef, private sanitizer: DomSanitizer, private auth: Auth, private router: Router, public _eventsService: EventsService) {}


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
  @Input() extErrorMessage: string
  errorMsg: string
  isError: boolean
  isLoading = false

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
      if (username.length < 4 || password.length < 4) {
        this.errorMsg = 'Invalid username or password!'
        return
      }
      this._eventsService.broadcast('loginStart');
      this.auth.login(username, password).then(
        (data) => this.onLoginSuccess(data),
        (error) => this.onLoginError(error, username));
    }
  }

  toggleIsLoading(isLoading?:boolean):void {
    isLoading = (isLoading !== undefined) ? isLoading : !this.isLoading
    this.isLoading = isLoading
    this.transitionInProgress = isLoading
  }1

  private onLoginError(err, username) {
    this.toggleIsLoading()    
    this.router.navigate(['/login'])
    setTimeout(() => { this._eventsService.broadcast('loginFail', err, {username: username}) },1)
  }

  private onLoginSuccess(data) {
    this.toggleIsLoading()
    console.log("ROUTER, MOVE YOUR ASS TO '/RESTRICTED' !!!")
    this.router.navigate(['/restricted'])
    this._eventsService.broadcast('loginSuccess');
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
    this.isError = this.extErrorMessage ? true : false

    this._eventsService.on('loginStart', () => {
      this.toggleIsLoading(true)
    })
    this._eventsService.on('loginSuccess', () => {
      this.toggleIsLoading(false)
    })
    this._eventsService.on('loginFail', (err) => {
      this.toggleIsLoading(false)
      this.isError = true
    })
  }

  public ngOnChanges() {
    this.isError = this.extErrorMessage ? true : false
  }

  public ngOnDestroy() {
    this.extErrorMessage = ''
    this.isError = false
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
