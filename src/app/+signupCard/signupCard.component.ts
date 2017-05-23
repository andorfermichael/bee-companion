import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import * as _ from 'lodash';

import { EventsService } from '../@services/events.service';
import { Auth } from '../@services/auth.service';

@Component({
  selector: 'signupCard',
  styleUrls: [ './signupCard.component.scss' ],
  templateUrl: './signupCard.component.html',
  animations: [
    trigger('fieldRequired', [
      state('inactive', style({
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      })),
      transition('inactive => active', [
        animate(300, keyframes([
          style({transform: 'translate3d(-1px, 0, 0)', borderColor: '#f6dd3b'}),
          style({transform: 'translate3d(2px, 0, 0)'}),
          style({transform: 'translate3d(-4px, 0, 0)'}),
          style({transform: 'translate3d(4px, 0, 0)'})
        ]))
      ]),
      transition('active => inactive', [
        animate(300, keyframes([
          style({transform: 'translate3d(4px, 0, 0)'}),
          style({transform: 'translate3d(-4px, 0, 0)'}),
          style({transform: 'translate3d(2px, 0, 0)'}),
          style({transform: 'translate3d(-1px, 0, 0)', borderColor: 'initial'})
        ]))
      ])
    ])
  ]
})

export class SignupCardComponent {
  public static fieldEmpty = {
    firstName: 'inactive',
    lastName: 'inactive',
    userName: 'inactive',
    email: 'inactive',
    password: 'inactive',
    passwordConfirm: 'inactive'
  };

  public static setFocus(elementRef) {
    if (!elementRef) {
      return;
    }
    elementRef.nativeElement.focus();
  }

  public static resetFieldEmtpy() {
    _.forOwn(SignupCardComponent.fieldEmpty, (val, key) => {
      _.set(SignupCardComponent.fieldEmpty, key, 'inactive');
    });
  }

  public forgotPassword: boolean;

  @ViewChild('firstName') public firstNameElementRef: any;
  @ViewChild('lastName') public lastNameElementRef: any;
  @ViewChild('userName') public userNameElementRef: any;
  @ViewChild('email') public emailElementRef: any;
  @ViewChild('password') public passwordElementRef: any;
  @ViewChild('passwordConfirm') public passwordConfirmElementRef: any;

  public elementRefs = {
    firstName: this.firstNameElementRef,
    lastName:  this.lastNameElementRef,
    userName:  this.userNameElementRef,
    email:     this.emailElementRef,
    password:  this.passwordElementRef,
    passwordConfirm:  this.passwordConfirmElementRef
  };

  public fullName: string;
  public submitErr: string;
  public errorMsg: string;
  public successMsg: string;

  constructor(public http: Http, public router: Router, public auth: Auth,
              public _eventsService: EventsService) {
  }

  public setActive(fieldname: string, active = true) {
    _.set(SignupCardComponent.fieldEmpty, fieldname, active ? 'active' : 'inactive');
    if (active) {
      SignupCardComponent.setFocus(_.get(this.elementRefs, fieldname));
    }
  }

  public checkInputs(
    firstName?: string,
    lastName?: string,
    username?: string,
    email?: string,
    password?: string,
    passwordConfirm?: string) {

    this.errorMsg = '';
    this.successMsg = '';

    const errors = [];

    if (!firstName) {
      this.setActive('firstName');
      errors.push('Your first name is required!');
    }
    if (!lastName) {
      this.setActive('lastName');
      errors.push('Your last name is required!');
    }
    if (!username) {
      this.setActive('userName');
      errors.push('Please enter a username!');
    }
    if (!email) {
      this.setActive('email');
      errors.push('Your Email-Address is required!');
    }
    if (!password) {
      this.setActive('password');
      errors.push('Password is required!');
    }
    if (!passwordConfirm) {
      this.setActive('passwordConfirm');
      errors.push('Password needs to be confirmed!');
    }
    if (password && passwordConfirm && (password !== passwordConfirm)) {
      this.setActive('password');
      this.setActive('passwordConfirm');
      errors.push('Passwords do not match!');
    }
    if (errors.length > 1) {
      this.errorMsg = 'Please check all highlighted fields! (' + errors.length + ')';
    } else if (errors.length === 1) {
      this.errorMsg = _.get(errors, '[0]', '');
    } else {
      this._eventsService.broadcast('loginStart');
      this.http.post('http://localhost:3000/api/auth/signup/', {
        user: {
          firstName,
          lastName,
          username,
          email,
          password
        }
      })
      .subscribe(
        (data) => {
          this._eventsService.broadcast('loginSuccess');
          this.fullName = [firstName, lastName].join(' ');
          this.successMsg = 'Your Signup was successful!';
        },
        (err) => {
          this._eventsService.broadcast('loginFail');
          try {
            err = JSON.parse(err._body);
            err = err.error;
          } catch (e) {
            console.log(e);
          }
          this.errorMsg = _.get(err, 'error.description', 'An unknown error ocurred!');
          this.submitErr = 'active';
          if (err.error.code === 'user_exists') {
            this.setActive('userName');
            this.setActive('email');
          }
          if (err.error.code === 'username_exists') {
            this.setActive('userName');
          }
        });
    }
  }
}
