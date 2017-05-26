import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, Component, Input } from '@angular/core';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
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
        this.sub = this.activatedRoute.params.subscribe((params) => {
           this.id = params['id']; // (+) converts string 'id' to a number
           this.fetchUserFromAPI(this.id);
           // In a real app: dispatch action to load the details here.
        });
        return;
      }
      this.localUser = this.user;
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private fetchUserFromAPI(username?: string) {
      if (!username) {
        return;
      }
      this.authHttp.get('http://localhost:3000/api/user/' + username)
          .subscribe(
              (data) => {
                  let userData;
                  try {
                    const parseData = data.json();
                    userData = _.isArray(parseData) && parseData.length ? parseData[0] : null;
                  } catch (e) {
                    console.log(e);
                  }
                  if (userData) {
                    this.localUser = userData;
                    console.log(userData);
                  }
              },
              (err) => {
                  console.error(err);
              });
    }

}
