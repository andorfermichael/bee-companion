import {
  Component,
  OnInit
} from '@angular/core';

import { Auth } from '../auth.service';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(public auth: Auth) {}

  public ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.checkUserHasRole();
    }
  }
}
