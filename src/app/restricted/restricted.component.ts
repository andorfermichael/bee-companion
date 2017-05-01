import {
  Component,
  OnInit
} from '@angular/core';

import { Auth } from '../auth.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'restricted'
  selector: 'restricted',  // <restricted></restricted>
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './restricted.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './restricted.component.html'
})
export class RestrictedComponent implements OnInit {
  // TypeScript public modifiers
  constructor(public auth: Auth) {}

  public ngOnInit() {
    console.log(this.auth.userProfile);
  }
}
