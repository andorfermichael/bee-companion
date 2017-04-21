import {
  Component,
  OnInit,
} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`mainCard` component loaded asynchronously');

@Component({
  selector: 'mainCard',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './mainCard.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './mainCard.component.html',
})
export class MainCardComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `mainCard` component');
  }

}
