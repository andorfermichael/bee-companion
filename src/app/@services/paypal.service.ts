import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PayPalService {
  private BASE_URL: string = process.env.ENV === 'development' ? 'http://localhost:3000'
    : 'https://bee-companion.com';

  private paypalApiUrl: string = this.BASE_URL + '/api/paypal';
  private paypalDBApiUrl: string = this.BASE_URL + '/api/paypaltransaction';

  constructor(public http: Http) {}

  public preparePayment(receiverEmail: string, amount: number): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const params = {
      receiverEmail,
      amount
    };

    const requestOptions = new RequestOptions({
      headers
    });

    return this.http.post(this.paypalApiUrl + '/payment/prepare', JSON.stringify(params),
      requestOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public executePayment(paymentId: string, payerId: string): Observable<any>  {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const params = {
      paymentId,
      payerId
    };

    const requestOptions = new RequestOptions({
      headers
    });

    return this.http.post(this.paypalApiUrl + '/payment/execute', JSON.stringify(params),
      requestOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public storePaymentDetailsInDatabase(payment: any): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const params = {
      paymentId: payment.id,
      intent: payment.intent,
      state: payment.state,
      paymentMethod: payment.payer.payment_method,
      payerEmail: payment.payer.payer_info.email,
      payerFirstName: payment.payer.payer_info.first_name,
      payerLastName: payment.payer.payer_info.last_name,
      payerId: payment.payer.payer_info.payer_id,
      shippingAddressRecipientName: payment.payer.payer_info.shipping_address.recipient_name,
      shippingAddressStreet: payment.payer.payer_info.shipping_address.line1,
      shippingAddressCadastral: payment.payer.payer_info.shipping_address.line2,
      shippingAddressCity: payment.payer.payer_info.shipping_address.city,
      shippingAddressState: payment.payer.payer_info.shipping_address.state,
      shippingAddressPostalCode: payment.payer.payer_info.shipping_address.postal_code,
      shippingAddressCountryCode: payment.payer.payer_info.shipping_address.country_code,
      payerCountryCode: payment.payer.payer_info.country_code,
      transactionTotalAmount: payment.transactions[0].amount.total,
      transactionCurrency: payment.transactions[0].amount.currency,
      createTime: payment.create_time
    };

    const requestOptions = new RequestOptions({
      headers
    });

    return this.http.post(this.paypalDBApiUrl + '/create', JSON.stringify(params), requestOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    return res.json() || { };
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
