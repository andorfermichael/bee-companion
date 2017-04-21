import {
  Component,
  OnInit,
} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`mainContent` component loaded asynchronously');

@Component({
  selector: 'mainContent',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './mainContent.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './mainContent.component.html'
})
export class MainContentComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `mainContent` component');
  }

}
