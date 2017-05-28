import { OnInit, OnChanges, OnDestroy, Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';

import * as _ from 'lodash';

@Component({
  selector: 'user-page',
  styleUrls: [ './userPage.component.scss' ],
  templateUrl: './userPage.component.html'
})

export class UserPageComponent implements OnInit, OnChanges, OnDestroy {

    public inEditMode: boolean;
    public id: string;
    public localUser: any;
    private sub: any;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp, private router: Router, private http: Http,
                  private location: Location ) {}

    public ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe((params) => {
           this.id = params['id']; // (+) converts string 'id' to a number
           console.log(this.id);
           this.fetchUserFromAPI(this.id);
           // In a real app: dispatch action to load the details here.
        });
        this.inEditMode = _.get(this.activatedRoute.snapshot.data, '[0]["inEditMode"]', false);
    }

    public ngOnChanges() {
      this.ngOnDestroy();
      this.ngOnInit();
    }

    public ngOnDestroy() {
      if (this.sub) {
        this.sub.unsubscribe();
      }
      this.id = '';
      this.localUser = null;
    }

    private processUserData(data: any): void {
      let userData;
      try {
        const parseData = data.json();
        userData = _.isArray(parseData) && parseData.length ? parseData[0] : null;
      } catch (e) {
        console.log(e);
      }
      if (userData) {
        this.localUser = userData;
      } else {
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 250);
      }
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
        console.log(this.localUser);
        return;
      }
      if (this.auth.isAuthenticated()) {
        // get authenticated information:
        this.authHttp.get('http://localhost:3000/api/auth/user/' + username)
          .subscribe(
              (data) => { this.processUserData(data); },
              (err) => {
                  console.error(err);
              });
      } else {
        // get public information
        this.http.get('http://localhost:3000/api/user/' + username)
               .toPromise()
               .then((data) => { this.processUserData(data); })
               .catch((err) => { console.error(err); });
      }
    }

}
