import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'id_token',
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenGetter: (() => localStorage.getItem('id_token')),
    globalHeaders: [{
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://bee-companion.com'}],
    }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule {}
