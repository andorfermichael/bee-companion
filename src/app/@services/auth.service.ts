import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, RequestMethod, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';
import Auth0Lock from 'auth0-lock';
import Auth0 from 'auth0-js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { myConfig, postConfig, necessaryRoles } from '../@config/auth.config';

interface SocialAuthorizeOptions extends Auth0.AuthorizeOptions {
  connection: string;
}

@Injectable()
export class Auth {
  public lock = new Auth0Lock(myConfig.clientID, myConfig.domain, myConfig.lock);
  public userProfile: any;
  public idToken: string;
  public signUpIncomplete: boolean;

  // Configure Auth0
  private auth0 = new Auth0.WebAuth({
    domain: myConfig.domain,
    clientID: myConfig.clientID,
    redirectUri: myConfig.redirectUri,
    responseType: myConfig.responseType
  });

  // Create a stream of logged in status to communicate throughout app
  private loggedIn: boolean;
  private loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(public router: Router, public http: Http) {
    // Set userProfile attribute of already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
  }

  public loginWithGoogle(): void {
    const opts: SocialAuthorizeOptions = {
      domain: myConfig.domain,
      clientID: myConfig.clientID,
      redirectUri: myConfig.redirectUri,
      responseType: myConfig.responseType,
      connection: 'google-oauth2'
    };
    this.auth0.authorize(opts);
  }

  public loginWithFacebook(): void {
    const opts: SocialAuthorizeOptions = {
      domain: myConfig.domain,
      clientID: myConfig.clientID,
      redirectUri: myConfig.redirectUri,
      responseType: myConfig.responseType,
      connection: 'facebook'
    };
    this.auth0.authorize(opts);
  }

  public login(username?: string, password?: string): Promise<any> {
    if (!username && !password) {
      return;
    }
    return this.processLogin(username, password);
  }

  public logout(): void {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.idToken = '';
    this.userProfile = null;
    this.setLoggedIn(false);

    // Go back to the home rout
    this.router.navigate(['/']);
  }

  public signup(email?, password?): void {
    if (email && password) {
      this.auth0.redirect.signupAndLogin({
        connection: 'Username-Password-Authentication',
        email,
        password,
      }, (err) => {
        if (err) {
          return alert(err.description);
        }
      });
    } else {
      const options = myConfig.lock;
      options.initialScreen = 'signUp';
      const lock = new Auth0Lock(myConfig.clientID, myConfig.domain, options);
      lock.show();
    }
  }

  public forgotPassword(username?: string, email?: string,
                        onSuccess?: any, onError?: any): Promise<any> {
    if (!username && !email) {
      return;
    }
    const options = myConfig.lock;
    options.initialScreen = 'forgotPassword';
    options.prefill = {
      email: email || '',
      username: username || ''
    };

    return this.processForgotPassword(email, username);
  }

  public isAuthenticated(): boolean {
    // Check whether the id_token is expired or not
    return tokenNotExpired('id_token');
  }
  // Call this method in app.component
  // if using path-based routing <== WE ARE USING PATH BASED ROUTING
  public handleAuth(): void {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // window.location.hash = '';
        this._getProfile(authResult);
      } else if (err) {
        this.router.navigate(['/']);
        console.error(`Error: ${err.error}`);
      }
    });
  }

  public checkUserHasRole(profile?: any): any {
    profile = profile ? profile : this.userProfile;
    let userHasNecessaryRole = false;
    if (!profile) {
      console.error('Profile is not set!');
      // additional actions probably need to be taken
      return false;
    }
    if (profile.roles.length) {
      for (const userRole of profile.roles) {
        for (const necessaryRole of necessaryRoles) {
          if (userRole === necessaryRole) {
            userHasNecessaryRole = true;
            this.signUpIncomplete = null;
            return userRole;
          }
        }
      }
    }
    if (!profile.roles.length || !userHasNecessaryRole) {
      console.log('User has no necessary role!');
      this.signUpIncomplete = true;
      return false;
    }
  }

  public _updateProfile(): void {
    const tokenId = localStorage.getItem('id_token');
    const tokenAc = localStorage.getItem('token');

    this.logout();

    if (tokenId && tokenAc) {
      this._getProfile({id_token: tokenId, access_token: tokenAc});
    }
  }

  private setLoggedIn(value: boolean): void {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  private _getProfile(authResult): void {
    // Use access token to retrieve user's profile and set session
    // const lock2 = new Auth0Lock(myConfig.clientID, myConfig.domain, myConfig.lock)
    const idToken = authResult.id_token || authResult.idToken;
    this.lock.getProfile(idToken, (error, profile) => {
      if (error) {
        // Handle error
        console.error(error.error);
        return;
      }
      // Save session data and update login status subject
      this._setSession(authResult, profile);
      if (!this.checkUserHasRole(profile)) {
        this.router.navigate(['/signup/complete']);
      } else {
        this.router.navigate(['/user/me']);
      }
    });
  }

  private _setSession(authResult, profile): void {
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.access_token || authResult.accessToken);
    localStorage.setItem('id_token', authResult.id_token || authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.idToken = authResult.id_token || authResult.idToken;
    this.setLoggedIn(true);
    this.userProfile = profile;
    this.checkUserHasRole(profile);
  }

  private processLogin(username?: string, password?: string): Promise<any> {
    const options = {
      client_id: myConfig.clientID,
      connection: postConfig.body.connection,
      grant_type: 'password',
      username,
      password,
      scope: myConfig.scope
    };
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    const reqOpts = new RequestOptions({
      method: RequestMethod.Post,
      url: postConfig.urlLogin,
      headers,
      body: options
    });
    return this.http.post(postConfig.urlLogin, options, reqOpts)
      .toPromise()
      .then(this.extractData)
      .then((data) => { this._getProfile(data); })
      .catch(this.handleLoginError);
  }

  private processForgotPassword(email?: string, username?: string): Promise<any> {
    const options = postConfig;
    options.body.email = email;
    const headers = new Headers();
    headers.append('content-type', options.headers['content-type']);
    const reqOpts = new RequestOptions({
      method: RequestMethod.Post,
      url: options.urlForgotPassword,
      headers,
      body: {
        client_id: options.body.client_id,
        username: username || '',
        email: email || '',
        connection: options.body.connection
      }
    });
    return this.http.post(options.urlForgotPassword, options.body, reqOpts)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private handleLoginError(error: Response | any): any {
    // simplified handleError method
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      errMsg = `${body.description || body.error_description || error.statusText }`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Promise.reject(errMsg);
  }

  private extractData(res: Response): any {
    let body: string;
    try {
      body = res.json();
    } catch (e) {
      body = res.text() || res.toString();
    }
    return body || { };
  }

  private handleError(error: Response | any): any {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Promise.reject(errMsg);
  }
}
