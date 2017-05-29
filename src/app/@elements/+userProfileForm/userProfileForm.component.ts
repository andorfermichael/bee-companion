import { OnInit, OnDestroy, OnChanges , Component, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';

import * as _ from 'lodash';

@Component({
  selector: 'userProfileForm',
  styleUrls: [ './userProfileForm.component.scss' ],
  templateUrl: './userProfileForm.component.html'
})

export class UserProfileFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public user: any;
  @Input() public role: any;
  public localUser: any;
  public errorMessage: string;
  public preventDisabledBtn: boolean;
  private sub: any;
  private changeSubmit: any;

  private BASE_URL: string =
  process.env.ENV === 'development' ? 'http://localhost:3000' :
  'https://bee-companion.com';

  constructor(public auth: Auth, public authHttp: AuthHttp, public router: Router) {}

  public ngOnInit() {
    if (!this.user) {
      console.error('User needs to be passed to userProfileForm Component!');
      return;
    }
    this.localUser = this.user;
  }

  public ngOnChanges() {
    this.ngOnDestroy();
    this.ngOnInit();
  }

  public ngOnDestroy() {
    this.localUser = null;
  }

    public getUserPrivacy() {
      this.authHttp.get(`${this.BASE_URL}/api/auth/user/${this.user.username}/userPrivacy/`)
          .subscribe(
              (data) => { console.log(data); },
              (err) => {
                  console.error(err);
              });
    }

    public validateForm(form: NgForm) {
      if (this.preventDisabledBtn) {
        this.preventDisabledBtn = false;
      }
      const formData = form.value;
      const requiredFields = ['given_name', 'family_name', 'username', 'email', 'country',
      'city', 'postal_code', 'street', 'street_number'];
      const fieldTitles = {
        given_name: 'first name',
        family_name: 'last name',
        postal_code: 'postal code',
        street_number: 'street number',
        paypal: 'paypal registered email address'
      };
      const errorFields = [];
      if (this.user.role === 'Beekeeper' || this.role === 'Beekeeper') {
        requiredFields.push('paypal');
      }
      _.each(requiredFields, (value) => {
        if (!_.get(formData, value)) {
          errorFields.push(_.get(fieldTitles, value, value));
        }
      });
      if (errorFields.length) {
        this.errorMessage = 'Please fill out following fields before you continue: Your '
        + errorFields.join(', ');
        if (!this.sub) {
          this.sub = form.valueChanges.subscribe(() => {
            this.validateForm(form);
          });
        }
      } else {
        if (this.sub) {
          this.errorMessage = null;
          this.sub.unsubscribe();
          this.sub = null;
        }
        this.updateUser();
      }
    }

    public updateUser(preventAction = false) {
      this.authHttp.post(`${this.BASE_URL}/api/auth/user/${this.user.username}/update/`,
          this.localUser)
            .subscribe(
                (data) => {
                  this.changeSubmit = null;
                  if (!preventAction) {
                    this.router.navigate(['/user/', this.localUser.username]);
                  }
                },
                (err) => {
                  this.changeSubmit = null;
                  if (!preventAction) {
                    this.errorMessage = _.get( err.json(), 'error', err.message ||
                     'An error ocurred while saving your data!');
                    if (_.get(err.json(), 'code') === 'usernameTaken') {
                      this.localUser.username = '';
                    }
                  }
                  this.preventDisabledBtn = true;
                });
    }
}
