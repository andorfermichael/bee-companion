import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';
import Auth0Lock from 'auth0-lock';
import auth0 from 'auth0-js';

import { myConfig }        from './auth.config';

// Avoid name not found warnings
// declare var auth0: any;

@Injectable()
export class Auth {
	// Configure Auth0
	auth0 = new auth0.WebAuth({
		domain: 'bee-companion.eu.auth0.com',
		clientID: 'GYa4pWTXDi17cBIf8bDtaFhTS1LiJwGr',
		// specify your desired callback URL
		redirectUri: 'http://localhost:3000',
		responseType: 'token id_token'
	});

	lock = new Auth0Lock(myConfig.clientID, myConfig.domain, myConfig.lock);

	constructor(private router: Router) {
		this
		.router
		.events
		.filter(event => event instanceof NavigationStart)
		.filter((event: NavigationStart) => (/access_token|id_token|error/).test(event.url))
		.subscribe(() => {
		  this.lock.resumeAuth(window.location.hash, (error, authResult) => {
		    if (error) return console.log(error);
		    localStorage.setItem('id_token', authResult.idToken);
		    this.router.navigate(['/']);
		  });
		});
	}

	public handleAuthentication(): void {
	    this.auth0.parseHash({ _idTokenVerification: false }, (err, authResult) => {
			if (err) {
				alert(`Error: ${err.errorDescription}`)
			}
				if (authResult && authResult.accessToken && authResult.idToken) {
				window.location.hash = '';
				localStorage.setItem('access_token', authResult.accessToken);
				localStorage.setItem('id_token', authResult.idToken);
				this.router.navigate(['/home']);
			}
	    });
	}

	public alertError(err): void {
		this.router.navigate(['/login', err]);
		if (err) {
			console.log(err);
			alert(err.description);
		}
	}

	public login(username?: string, password?: string, callback?: any): void {
	 	if (!username || !password) return;
	 	callback = callback || this.alertError;
		this.auth0.redirect.loginWithCredentials({
	      connection: 'Username-Password-Authentication',
	      username,
	      password
	    }, callback );
	}

	public loginWithWidget(): void {
		this.lock.show();
	}

	public signup(email?, password?): void {
		if (email && password) {
			this.auth0.redirect.signupAndLogin({
		      connection: 'Username-Password-Authentication',
		      email,
		      password,
		    }, err => {
		      if (err) return alert(err.description);
		    });
		} else {
			let options = myConfig.lock;
			options.initialScreen = 'signUp';
			const lock = new Auth0Lock(myConfig.clientID, myConfig.domain, options);
			lock.show();
		}
	}

	public loginWithGoogle(): void {
	    this.auth0.authorize({
	      connection: 'google-oauth2',
	    });
	}

	public loginWithFacebook(): void {
	    this.auth0.authorize({
	      connection: 'facebook',
	    });
	}

	public isAuthenticated(): boolean {
	    // Check whether the id_token is expired or not
	    return tokenNotExpired('id_token');
	}

	public logout() {
		// Remove token from localStorage
	    localStorage.removeItem('access_token');
	    localStorage.removeItem('id_token');
	}

	private setUser(authResult): void {
		localStorage.setItem('access_token', authResult.accessToken);
		localStorage.setItem('id_token', authResult.idToken);
	}
}