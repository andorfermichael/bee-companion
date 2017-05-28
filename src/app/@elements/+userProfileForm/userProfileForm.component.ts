import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, OnChanges , Component, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
    @Input() public userPrivacy: any;
    public localUser: any;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp, public router: Router) {
    }

    public getUserPrivacy() {
      this.authHttp.get(`http://localhost:3000/api/auth/user/${this.user.username}/userPrivacy/`)
          .subscribe(
              (data) => { console.log(data); },
              (err) => {
                  console.error(err);
              });
    }

    public updateUser(form: NgForm) {
      console.log(this.user);
    }

    public ngOnInit() {
      if (!this.user) {
        console.error('User needs to be passed to userProfileForm Component!');
        return;
      }
      this.localUser = this.user;
      this.userPrivacy = this.user;
    }

    public ngOnChanges() {
      this.ngOnDestroy();
      this.ngOnInit();
    }

    public ngOnDestroy() {
      this.localUser = null;
    }
}
