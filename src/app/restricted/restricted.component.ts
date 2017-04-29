import {
  Component,
  OnInit
} from '@angular/core';

import { XLargeDirective } from './x-large';
import { NavComponent } from '../+nav';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'restricted'
  selector: 'restricted',  // <restricted></restricted>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './restricted.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './restricted.component.html'
})
export class RestrictedComponent implements OnInit {
  // TypeScript public modifiers
  constructor() {}

  public ngOnInit() {
    console.log('hello `restricted` component');
    // this.title.getData().subscribe(data => this.data = data);
  }
}
