import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router, NavigationStart } from '@angular/router';
import { Http, Headers, RequestOptions, Request, RequestMethod, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';
import Auth0Lock from 'auth0-lock';
import auth0 from 'auth0-js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { myConfig, postConfig } from './auth.config';

// Avoid name not found warnings
// declare var auth0: any;

@Injectable()
export class Auth {
	// Configure Auth0
	auth0 = new auth0.WebAuth({
		domain: myConfig.domain,
		clientID: myConfig.clientID,
		// specify your desired callback URL
		redirectUri: myConfig.redirectUri,
		responseType: myConfig.responseType
	});

	// Create a stream of logged in status to communicate throughout app
	loggedIn: boolean;
	loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

	lock = new Auth0Lock(myConfig.clientID, myConfig.domain, myConfig.lock);

	constructor(private router: Router, private http: Http) {
		this
		.router
		.events
		.filter(event => event instanceof NavigationStart)
		.filter((event: NavigationStart) => (/access_token|id_token|error/).test(event.url))
		.subscribe(() => {
		  this.lock.resumeAuth(window.location.hash, (error, authResult) => {
		    if (error) return console.log(error);
		    localStorage.setItem('id_token', authResult.idToken);
		    this.setLoggedIn(true);
		    this.router.navigate(['/']);
		  });
		});
	}

	setLoggedIn(value: boolean) {
		// Update login status subject
		this.loggedIn$.next(value);
		this.loggedIn = value;
	}

 	handleAuth() {
		// When Auth0 hash parsed, get profile
		this.auth0.parseHash({}, (err, authResult) => {
		  if (authResult && authResult.accessToken && authResult.idToken) {
		    window.location.hash = '';
		    this._getProfile(authResult);
		    this.router.navigate(['/']);
		  } else if (err) {
		    this.router.navigate(['/']);
		    console.error(`Error: ${err.error}`);
		  }
		});
	}

	private _getProfile(authResult) {
		// Use access token to retrieve user's profile and set session
		this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
		  this._setSession(authResult, profile);
		});
	}

	private _setSession(authResult, profile) {
		// Save session data and update login status subject
		localStorage.setItem('token', authResult.accessToken);
		localStorage.setItem('id_token', authResult.idToken);
		localStorage.setItem('profile', JSON.stringify(profile));
		this.setLoggedIn(true);
	}

	logout() {
	    // Remove tokens and profile and update login status subject
	    localStorage.removeItem('token');
	    localStorage.removeItem('id_token');
	    localStorage.removeItem('profile');
	    this.router.navigate(['/']);
	    this.setLoggedIn(false);
	}

	get authenticated() {
		// Check if there's an unexpired access token
		return tokenNotExpired('token');
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

	public login(username?:string, password?:string): Promise<any> {
		if (!username && !password)
			return
		this.auth0.redirect.loginWithCredentials({
			connection: postConfig.body.connection,
			username: username,
			password: password,
			scope: 'openid'
		}, this.callback);
		return this.processLogin(username, password)
	}

	callback (data) {
		console.log(data)
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

	public forgotPassword(username?:string, email?:string, onSuccess?:any, onError?:any): Promise<any> {
		if (!username && !email)
			return
		let options = myConfig.lock;
		options.initialScreen = 'forgotPassword';
		options.prefill = {
			email: email || '',
			username: username ||''
		}
		// const lock = new Auth0Lock(myConfig.clientID, myConfig.domain, options);
		// lock.show();
		return this.processForgotPassword(email, username)
	}

	private processForgotPassword(email?: string, username?: string): Promise<any> {
		const options = postConfig
		options.body.email = email
		const headers = new Headers();
    	headers.append('content-type', options.headers['content-type']);
		const reqOpts = new RequestOptions({
			method: RequestMethod.Post,
			url: options.urlForgotPassword,
			headers: headers,
			body: { 
				client_id: options.body.client_id,
				username: username || '',
				email: email || '',
		 		connection: options.body.connection
		 	}
		})
		return this.http.post(options.urlForgotPassword, options.body, reqOpts)
			.toPromise()
			.then(this.extractData)
			.catch(this.handleError);
	}

	private processLogin(username?: string, password?: string): Promise<any> {
		// const options = postConfig
		// options.body.email = email
		const options = {
			client_id: myConfig.clientID,
			connection: postConfig.body.connection,
			password: password,
			redirect_uri: myConfig.redirectUri,
			response_type: myConfig.responseType,
			scope: myConfig.scope,
			tenant: myConfig.tenant,
			username: username
		}
		const headers = new Headers();
    	headers.append('content-type', postConfig.headers['content-type']);
		const reqOpts = new RequestOptions({
			method: RequestMethod.Post,
			url: postConfig.urlLogin,
			headers: headers,
			body: options
		})
		return this.http.post(postConfig.urlLogin, options, reqOpts)
			.toPromise()
			.then(this.extractData)
			.catch(this.handleLoginError);
	}

	private handleLoginError (error: Response | any) {
		//simplified handleError method
		let errMsg: string
		if (error instanceof Response) {
			const body = error.json() || '';
			errMsg = `${body.description || error.statusText}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		return Promise.reject(errMsg);
	}

	private extractData(res: Response) {
		let body: string
		try {
			body = res.json()
		}
		catch(e) {
			body = res.toString()
		}
		return body || { };
	}

	private handleError (error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error ||JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		return Promise.reject(errMsg);
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

	private setUser(authResult): void {
		localStorage.setItem('access_token', authResult.accessToken);
		localStorage.setItem('id_token', authResult.idToken);
	}
}