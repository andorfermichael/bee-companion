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
    @Input() public inEditMode: boolean;

    public localUser: any;
    public userRole: string;
    public isCurrentUser: boolean;
    public isAuthenticated: boolean;
    public interests: string;
    public sub: any;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp) {
    }

    // birthday is a date
    public calculateAge(birthday: any) { // pass in player.dateOfBirth
      const ageDifMs = Date.now() - new Date(birthday);
      const ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    public ngOnInit() {
      this.isAuthenticated = this.auth.isAuthenticated();
      if (!this.user) {
        console.error('User needs to be passed to userProfile Component!');
        return;
      }
      this.localUser = this.user;
      const userId = _.get(this.user, 'user_id') || _.get(this.user, 'auth_user_id', 'unknown');

      if (userId === _.get(this.auth.userProfile, 'user_id')
        && this.isAuthenticated) {
        this.isCurrentUser = true;
        console.log('USER IS USER!');
      }
      this.userRole = _.get(this.localUser, 'roles[0]', null) ||
                      _.get(this.localUser, 'app_metadata.roles[0]', null) ||
                      _.get(this.localUser, 'role');
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
      this.userRole = null;
    }
}
