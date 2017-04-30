import {
  Component,
  OnInit,
  ElementRef,
  HostListener
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Nav` component loaded asynchronously');

@Component({
  selector: 'nav-bar',
  styleUrls: [ './nav.component.scss' ],
  templateUrl: './nav.component.html',
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
    ])
  ]
})
export class NavComponent implements OnInit {
  public loginClicked = false;
  public loginInputs = 'inactive';
  public loginButtons = 'active';
  public gradientBarBackground;
  public lastPosition = 0;
  public transitionInProgress = false;

  constructor(private elemRef: ElementRef, private sanitizer: DomSanitizer) {  }

  @HostListener('window:onclick', ['$event'])
  public onClick(event) {
   if (!this.elemRef.nativeElement.contains(event.target) && this.loginClicked) {
    this.clickedLogin();
   }
  }

  @HostListener('window:mouseover', ['$event'])
  public onMouseOver(event) {
    if (!this.transitionInProgress) {
      this.transitionInProgress = true;
      this.createGradientTransition(this.getOffsetLeft(event.srcElement));
    }
  }

  @HostListener('window:mouseleave', ['$event'])
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

  public createGradient(position) {
    const gradient =
      'linear-gradient(to right, #292b2c ' +
      (position - 80) + 'px, #f6dd3b ' +
      (position) + 'px, #292b2c ' +
      (position + 80) + 'px)';
    this.gradientBarBackground = this.sanitizer.bypassSecurityTrustStyle(gradient);
  }

  public getOffsetLeft(element) {
    if ((element.offsetWidth / 2) + element.offsetLeft + element.offsetParent) {
      return element.offsetParent.offsetLeft;
    } else {
      return 0;
    }
  }

  public ngOnInit() {
    console.log('hello `Nav` component');
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
}
