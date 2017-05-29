import { Observable } from 'rxjs/Observable';

export class MockAuthService {
  public authenticated: boolean = true;
  public hasUserRole: boolean = true;
  public userProfile: any;

  public handleAuth(): void {
    return;
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public checkUserHasRole(): any {
    if (this.userProfile !== 'undefined' && this.userProfile.role === 'Admin') {
      return this.userProfile.role;
    }
    return this.hasUserRole;
  }

  public _updateProfile(): boolean {
    return true;
  }

  public loginWithGoogle(): void {
    return;
  }

  public loginWithFacebook(): void {
    return;
  }

  public login(username?: string, password?: string): Promise<any> {
    if (!username && !password) {
      return;
    }
    return this.processLogin(username, password);
  }

  public forgotPassword(username?: string, email?: string): any {
    if (username == 'reject') {
      return Promise.reject('error');
    } else {
      return Promise.resolve();
    }
  }

  private processLogin(username?: string, password?: string): Promise<any> {
    if (username == 'reject') {
      return Promise.reject('error');
    } else {
      return Promise.resolve();
    }
  }
}

export class MockAuthHttp {
  public get(url: string): Observable<any> {
    if (url === `http://localhost:8000/api/auth/user/set/role/Error` ||
      url === `https://bee-companion.com/api/auth/user/set/role/Error`) {
      return Observable.throw({});
    } else {
      return Observable.of({});
    }
  }
}

export class MockAuth0WebAuth {
  public authorize({connection, redirect_uri}: any) {
    return;
  }
}


