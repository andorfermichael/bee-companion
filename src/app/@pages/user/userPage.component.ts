import { OnInit, OnChanges, OnDestroy, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

import * as _ from 'lodash';

@Component({
  selector: 'user-page',
  styleUrls: [ './userPage.component.scss' ],
  templateUrl: './userPage.component.html'
})
export class UserPageComponent implements OnInit, OnChanges, OnDestroy {
  public inEditMode: boolean;
  public initialSetupMode: boolean = false;
  public id: string;
  public localUser: any;
  private sub: any;

  private BASE_URL: string =
  process.env.ENV === 'development' ? 'http://localhost:3000' :
  'https://bee-companion.com';

  constructor(public titleService: Title, public auth: Auth,
              public activatedRoute: ActivatedRoute,
              public authHttp: AuthHttp, public router: Router, public http: Http) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.UserComponent);
    this.sub = this.activatedRoute.params.subscribe((params) => {
       this.id = params['id'];
       console.log(this.id);
       this.fetchUserFromAPI(this.id);
    });
    this.inEditMode = _.get(this.activatedRoute.snapshot.data, '[0]["inEditMode"]', false);
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.id = '';
    this.localUser = null;
  }

  public ngOnChanges() {
    this.ngOnDestroy();
    this.ngOnInit();
  }

  private checkUserData(userData: any): void {
    if (!_.get(userData, 'username') && !this.initialSetupMode) {
      this.inEditMode = true;
      this.initialSetupMode = true;
      return;
    }
    if (_.get(userData, 'username') && this.initialSetupMode) {
      this.inEditMode = true;
    }
  }

  private processUserData(data: any): void {
    let userData;
    try {
      userData = data.json();
    } catch (e) {
      console.log(e);
    }
    if (userData) {
      this.localUser = userData;
      this.checkUserData(userData);
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
      if (!this.auth.isAuthenticated()) {
        this.router.navigate(['/login']);
        return;
      }
    }
    if (this.auth.isAuthenticated()) {
      // set localUser to null to toggle loading animation
      this.localUser = null;
      // get authenticated information:
      this.authHttp.get(`${this.BASE_URL}/api/auth/user/${username}`)
        .subscribe(
            (data) => { this.processUserData(data); },
            (err) => {
                console.error(err.json());
                setTimeout(() => {
                  this.router.navigate(['/home']);
                }, 250);
            });
    } else {
      // get public information
      this.http.get(`${this.BASE_URL}/api/user/${username}`)
             .toPromise()
             .then((data) => { this.processUserData(data); })
             .catch((err) => { console.error(err); });
    }
  }
}
