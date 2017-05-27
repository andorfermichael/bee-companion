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

export class UserProfileComponent implements OnInit, OnDestroy {

    @Input() public user: any;
    public id: string;
    public localUser: any;
    private sub: any;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp ) {}

    public ngOnInit() {
      if (!this.user) {
        console.error('User needs to be passed to userProfile Component!');
      }
      this.localUser = this.user;
    }

    public ngOnDestroy() {
      if (this.sub) {
        this.sub.unsubscribe();
      }
    }
}
