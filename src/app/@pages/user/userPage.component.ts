import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';
import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';

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

    constructor(private titleService: Title, public auth: Auth,
                private activatedRoute: ActivatedRoute,
                public authHttp: AuthHttp, private router: Router, private http: Http ) {}

    public ngOnInit() {
      this.titleService.setTitle(PageTitlePrefix + PageTitles.UserComponent);
      this.sub = this.activatedRoute.params.subscribe((params) => {
         this.id = params['id'];
         console.log(this.id);
         this.fetchUserFromAPI(this.id);
      });
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
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
        console.log(userData);
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
