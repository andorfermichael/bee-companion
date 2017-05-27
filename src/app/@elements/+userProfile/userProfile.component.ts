import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, OnChanges , Component, Input } from '@angular/core';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { HttpModule } from '@angular/http';

import * as _ from 'lodash';

@Component({
  selector: 'userProfile',
  styleUrls: [ './userProfile.component.scss' ],
  templateUrl: './userProfile.component.html'
})

export class UserProfileComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public user: any;

    public localUser: any;
    public isCurrentUser: boolean;
    public isAuthenticated: boolean;
    public sub: any;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp) {
    }

    public ngOnInit() {
      if (!this.user) {
        console.error('User needs to be passed to userProfile Component!');
        return;
      }
      this.localUser = this.user;
      if (_.get(this.user, 'user_id') === _.get(this.auth.userProfile, 'user_id')) {
        this.isCurrentUser = true;
        console.log('USER IS USER!');
      }
      this.isAuthenticated = this.auth.isAuthenticated();
    }

    public ngOnChanges() {
      this.ngOnDestroy();
      this.ngOnInit();
    }

    public ngOnDestroy() {
      if (this.sub) {
        this.sub.unsubscribe();
      }
      this.isCurrentUser = false;
      this.localUser = null;
      this.isAuthenticated = false;
    }
}
