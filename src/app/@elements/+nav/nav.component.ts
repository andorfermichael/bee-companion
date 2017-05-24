import { Component, OnInit, ElementRef, HostListener, ViewChild, Input } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'nav-bar',
  styleUrls: ['./nav.component.scss'],
  templateUrl: './nav.component.html',
  animations: [
    trigger('loginClickedState', [
      state('inactive', style({
        display: 'none',
        transform: 'translateX(120%)'
      })),
      state('active', style({
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
      state('active', style({
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
  public static getOffsetLeft(element) {
    return (element.offsetWidth / 2) + element.offsetLeft +
      (element.offsetParent ? element.offsetParent.offsetLeft : 0);
  }

  public static setFocus(elementRef) {
    elementRef.nativeElement.focus();
  }

  public loginClicked: boolean = false;
  public loginInputs: string = 'inactive';
  public loginButtons: string = 'active';
  public gradientBarBackground: any;
  public lastPosition: number = 0;
  public transitionInProgress: boolean = false;
  public usernameEmpty: string = 'inactive';
  public passwordEmpty: string = 'inactive';
  @ViewChild('username') public usernameElementRef: any;
  @ViewChild('password') public passwordElementRef: any;
  @Input() public disableInlineLogin: boolean;
  @Input() public headerToggle: boolean = false;
  @Input() public extErrorMessage: string;
  public errorMsg: string;
  public isError: boolean;
  public isLoading = false;

  constructor(private elemRef: ElementRef, private sanitizer: DomSanitizer,
              public auth: Auth, private router: Router, public _eventsService: EventsService,
              private localStorage: LocalStorageService) {
  }

  @HostListener('click', ['$event'])
  public onClick(event) {
    if (!this.elemRef.nativeElement.contains(event.target) && this.loginClicked) {
      this.clickedLogin();
    }
  }

  @HostListener('mouseover', ['$event'])
  public onMouseOver(event) {
    if (!this.transitionInProgress) {
      this.transitionInProgress = true;
      this.createGradientTransition(NavComponent.getOffsetLeft(event.srcElement));
    }
  }

  @HostListener('mouseleave', ['$event'])
  public onMouseLeave(event) {
    this.gradientBarBackground = '';
  }

  public createGradientTransition(to) {
    if (this.lastPosition < to) {
      if (to - this.lastPosition < 10) {
        this.createGradient(to);
        this.transitionInProgress = false;
        return;
      }
      this.lastPosition += 10;
      setTimeout(() => {
        this.createGradient(this.lastPosition);
        this.createGradientTransition(to);
      }, 1);
    } else if (this.lastPosition > to) {
      if (this.lastPosition - to < 10) {
        this.createGradient(to);
        this.transitionInProgress = false;
        return;
      }
      this.lastPosition -= 10;
      setTimeout(() => {
        this.createGradient(this.lastPosition);
        this.createGradientTransition(to);
      }, 1);
    } else {
      this.transitionInProgress = false;
    }
  }

  public resetUsernamePasswordEmtpy() {
    this.usernameEmpty = 'inactive';
    this.passwordEmpty = 'inactive';
  }

  public checkInputs(username?: string, password?: string) {
    if (!password) {
      this.passwordEmpty = 'active';
      NavComponent.setFocus(this.passwordElementRef);
      this.errorMsg = 'Password is required!';
    }
    if (!username) {
      this.usernameEmpty = 'active';
      NavComponent.setFocus(this.usernameElementRef);
      this.errorMsg = 'Username is required!';
    }
    if (!username && !password) {
      this.errorMsg = 'Username and password are required!';
    }
    if (username && password) {
      if (username.length < 4 || password.length < 4) {
        this.errorMsg = 'Invalid username or password!';
        return;
      }
      this._eventsService.broadcast('loginStart');
      this.auth.login(username, password).then(
        (data: any) => this.onLoginSuccess(),
        (error) => this.onLoginError(error, username));
    }
  }

  public toggleHeader() {
    this._eventsService.broadcast('headerToggled', !this.headerToggle);
  }

  public toggleIsLoading(isLoading?: boolean): void {
    isLoading = (isLoading !== undefined) ? isLoading : !this.isLoading;
    this.isLoading = isLoading;
    this.transitionInProgress = isLoading;
  }

  public createGradient(position) {
    const gradient = 'linear-gradient(to right, #292b2c ' + (position - 80) +
                     'px, #f6dd3b ' + (position) + 'px, #292b2c ' + (position + 80) + 'px)';
    this.gradientBarBackground = this.sanitizer.bypassSecurityTrustStyle(gradient);
  }

  public ngOnInit() {
    this.isError = !!this.extErrorMessage;

    this._eventsService.on('loginStart', () => {
      this.toggleIsLoading(true);
    });
    this._eventsService.on('loginSuccess', () => {
      this.toggleIsLoading(false);
    });
    this._eventsService.on('loginFail', () => {
      this.toggleIsLoading(false);
      this.isError = true;
    });
    this.headerToggle = this.localStorage.retrieve('headerIsToggled');
    this._eventsService.on('headerToggled', (toggle) => {
      this.headerToggle = toggle;
    });
  }

  public clickedLogin() {
    this.loginInputs = !this.loginClicked ? 'active' : 'inactive';
    if (this.loginClicked) {
      setTimeout(() => {
        this.loginClicked = !this.loginClicked;
        this.loginButtons = !this.loginClicked ? 'active' : 'inactive';
      }, 250);
    } else {
      this.loginButtons = this.loginClicked ? 'active' : 'inactive';
      setTimeout(() => {
        this.loginClicked = !this.loginClicked;
      }, 250);
    }
  }

  private onLoginSuccess() {
    this.toggleIsLoading();
    console.log("Router, go to '/RESTRICTED' !");
    this.router.navigate(['/restricted']);
    this._eventsService.broadcast('loginSuccess');
  }

  private onLoginError(err, username) {
    this.toggleIsLoading();
    this.router.navigate(['/login']);
    setTimeout(() => {
      this._eventsService.broadcast('loginFail', err, {username});
    }, 1);
  }
}
