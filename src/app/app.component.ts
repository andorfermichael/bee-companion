/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Auth } from './auth.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ Auth ],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
  <div class="container-fluid">
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/BeeCompanion_smallLogo.png';
  public name = 'BeeCompanion';
  public url = 'https://www.bee-companion.com/';

  constructor(
    private auth: Auth
  ) {
    this.auth.handleAuth();
  }

  public ngOnInit() {}

}
