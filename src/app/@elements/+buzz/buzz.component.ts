import { OnInit, OnDestroy, OnChanges , Component, Input } from '@angular/core';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';

import * as _ from 'lodash';

@Component({
  selector: 'buzz',
  styleUrls: [ './buzz.component.scss' ],
  templateUrl: './buzz.component.html'
})
export class SingleBuzzComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public user: any;
  @Input() public role: any;
  @Input() public buzz: any;
  public isAuthenticated: boolean;
  public isCurrentUser: boolean;
  public userRole: string;

  private BASE_URL: string =
  process.env.ENV === 'development' ? 'http://localhost:3000' :
  'https://bee-companion.com';

  constructor(public auth: Auth, public authHttp: AuthHttp) {}

  public ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();
    if (!this.user) {
      console.error('User needs to be passed to buzz Component!');
      return;
    }
    const userId = _.get(this.user, 'user_id') || _.get(this.user, 'auth_user_id', 'unknown');

    if (userId === _.get(this.auth.userProfile, 'user_id')
      && this.isAuthenticated) {
      this.isCurrentUser = true;
      console.log('USER IS USER!');
    }
  }

  public ngOnChanges() {
    this.ngOnDestroy();
    this.ngOnInit();
  }

  public ngOnDestroy() {
    this.isCurrentUser = false;
    this.isAuthenticated = false;
    this.userRole = null;
  }

  public timeDifference( previous: any ): string {
    const current = new Date().getTime();
    previous = new Date(previous).getTime();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay ) {
      return Math.round(elapsed / msPerHour ) + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
      return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
      return 'approximately ' + Math.round(elapsed / msPerYear ) + ' years ago';
    }
  }

  public updateScope(scope: string) {
    this.buzz.scope = scope;
    this.updateBuzz();
  }

  private updateBuzz() {
    this.authHttp.post(`${this.BASE_URL}/api/auth/buzz/${this.buzz.id}/update`, this.buzz)
      .subscribe(
        (data) => { console.log('Buzz Scope updated successfully.'); },
        (error) => { console.log(error); } );
      return false;
  }
}
