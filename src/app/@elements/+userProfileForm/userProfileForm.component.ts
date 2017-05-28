import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, OnChanges , Component, Input, } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { HttpModule } from '@angular/http';

import * as _ from 'lodash';

@Component({
  selector: 'userProfileForm',
  styleUrls: [ './userProfileForm.component.scss' ],
  templateUrl: './userProfileForm.component.html'
})

export class UserProfileFormComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public user: any;
    public localUser: any;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp, public router: Router) {
    }

    public ngOnInit() {
      if (!this.user) {
        console.error('User needs to be passed to userProfileForm Component!');
        return;
      }
      this.localUser = this.user;
      if (_.get(this.user, 'user_id') !== _.get(this.auth.userProfile, 'user_id')) {
        this.router.navigate(['/home']);
      }
    }

    public ngOnChanges() {
      this.ngOnDestroy();
      this.ngOnInit();
    }

    public ngOnDestroy() {
      this.localUser = null;
    }
}
