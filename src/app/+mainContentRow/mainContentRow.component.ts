import {
  Component,
  OnInit,
} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`mainContentRow` component loaded asynchronously');

@Component({
  selector: 'mainContentRow',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './mainContentRow.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './mainContentRow.component.html',
})
export class MainContentRowComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `mainContentRow` component');
  }

}
