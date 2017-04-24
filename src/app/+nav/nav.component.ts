import {
  Component,
  OnInit,
  ElementRef,
  trigger, state, animate, transition, style
} from '@angular/core';

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
    ])
  ]
})
export class NavComponent implements OnInit {
  constructor(private elemRef: ElementRef) { }

  onClick(event) {
   if (!this.elemRef.nativeElement.contains(event.target) && this.loginClicked) {
    this.clickedLogin()
   }
  }

  loginClicked = false
  loginInputs = 'inactive'
  loginButtons = 'active'

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
