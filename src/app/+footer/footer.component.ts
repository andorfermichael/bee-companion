import {
  Component,
  OnInit,
} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Footer` component loaded asynchronously');

@Component({
  selector: 'footer',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './footer.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `Footer` component');
  }

}
