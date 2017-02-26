import {
  Component,
  OnInit,
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
  styleUrls: [ './nav.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `Nav` component');
  }

}
