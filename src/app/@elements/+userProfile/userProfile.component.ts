import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, Component, Input } from '@angular/core';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { HttpModule } from '@angular/http';

import * as _ from 'lodash';

@Component({
  selector: 'userProfile',
  styleUrls: [ './userProfile.component.scss' ],
  templateUrl: './userProfile.component.html'
})

export class UserProfileComponent implements OnInit {

    @Input() public user: any;

    public localUser: any;
    public isCurrentUser: boolean;
    public isAuthenticated: boolean;
    public picture: string;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp ) {}

    public ngOnInit() {
      if (!this.user) {
        console.error('User needs to be passed to userProfile Component!');
        return;
      }
      this.localUser = this.user;
      if (this.user.username === this.auth.userProfile.username) {
        this.isCurrentUser = true;
      }
      this.isAuthenticated = this.auth.isAuthenticated();
      this.picture = this.localUser.picture;
    }
}
