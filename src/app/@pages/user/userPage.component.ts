import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import * as _ from 'lodash';

@Component({
  selector: 'user-page',
  styleUrls: [ './userPage.component.scss' ],
  templateUrl: './userPage.component.html'
})

export class UserPageComponent implements OnInit, OnDestroy {

    public id: string;
    public localUser: any;
    private sub: any;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp, private router: Router ) {}

    public ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe((params) => {
           this.id = params['id']; // (+) converts string 'id' to a number
           console.log(this.id);
           this.fetchUserFromAPI(this.id);
           // In a real app: dispatch action to load the details here.
        });
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private fetchUserFromAPI(username?: string) {
      if (!username) {
        return;
      }
      if (username === 'me') {
        if (!this.auth.isAuthenticated() || !this.auth.userProfile) {
          this.router.navigate(['/login']);
          return;
        }
        this.localUser = this.auth.userProfile;
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
