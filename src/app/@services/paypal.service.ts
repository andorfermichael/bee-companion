import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PayPalService {

  private BASE_URL: string =
  process.env.ENV === 'development' ? 'http://localhost:3000' :
  'https://bee-companion.com';

  private paypalApiUrl: string = this.BASE_URL + '/api/paypal';
  private paypalDBApiUrl: string = this.BASE_URL + '/api/paypaltransaction';

  constructor(public http: Http) {}

  public executeAdaptivePayment(receiverEmail: string, amount: number): Observable<any> {
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

    return this.http.post(this.paypalApiUrl + '/pay', JSON.stringify(params), requestOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getPaymentDetails(payKey: string): Observable<any>  {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const params = {
      payKey
    };

    const requestOptions = new RequestOptions({
      headers
    });

    return this.http.post(this.paypalApiUrl + '/pay/payment-details', JSON.stringify(params),
      requestOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public storePaymentDetailsInDatabase(payment: any): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const params = {
      responseEnvelopeTimestamp: payment.responseEnvelope.timestamp,
      responseEnvelopeAck: payment.responseEnvelope.ack,
      responseEnvelopeCorrelationId: payment.responseEnvelope.correlationId,
      responseEnvelopeBuild: payment.responseEnvelope.build,
      currencyCode: payment.currencyCode,
      transactionId: payment.paymentInfoList.paymentInfo[0].transactionId,
      transactionStatus: payment.paymentInfoList.paymentInfo[0].transactionStatus,
      receiverAmount: payment.paymentInfoList.paymentInfo[0].receiver.amount,
      receiverEmail: payment.paymentInfoList.paymentInfo[0].receiver.email,
      receiverPrimary: payment.paymentInfoList.paymentInfo[0].receiver.primary,
      receiverPaymentType: payment.paymentInfoList.paymentInfo[0].receiver.paymentType,
      receiverAccountId: payment.paymentInfoList.paymentInfo[0].receiver.accountId,
      refundedAmount: payment.paymentInfoList.paymentInfo[0].refundedAmount,
      pendingRefund: payment.paymentInfoList.paymentInfo[0].pendingRefund,
      senderTransactionId: payment.paymentInfoList.paymentInfo[0].senderTransactionId,
      senderTransactionStatus: payment.paymentInfoList.paymentInfo[0].senderTransactionStatus,
      status: payment.status,
      payKey: payment.payKey,
      actionType: payment.actionType,
      feesPayer: payment.feesPayer,
      senderEmail: payment.sender.email,
      senderAccountId: payment.sender.accountId
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
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
