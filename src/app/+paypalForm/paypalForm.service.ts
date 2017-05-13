import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PayPalFormService {
  private paypalApiUrl = 'http://localhost:3000/api/paypal';

  constructor(private http: Http) {}

  public executeAdaptivePayment(receiverMail: string, amount: string): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    // Set request params
    const params: URLSearchParams = new URLSearchParams();
    params.set('receiverMail', receiverMail);
    params.set('amount', amount);

    return this.http.post(this.paypalApiUrl + '/pay', params.toString(), { headers })
      .map( (res: Response) => res.json() )
      .catch( (error: any) => Observable.throw(error.json().error || 'Server error') );
  }
}
