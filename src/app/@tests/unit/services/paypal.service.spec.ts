import { TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { PayPalService } from '../../../@services/paypal.service';

import {
  fakePaypalAdaptivePaymentResponse,
  fakePaypalAdaptivePaymentDetailsResponse,
  fakeStorePaymentDetailsInDatabaseResponse
} from '../_doubles/paypal.service.doubles'

describe('PayPalService', () => {
  let paypalService: PayPalService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayPalService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (mockBackend, defaultOptions) => {
            return new Http(mockBackend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  beforeEach(() => {
    paypalService = TestBed.get(PayPalService);
    backend = TestBed.get(MockBackend);
  });

  it('executeAdaptivePayment should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      if (process.env === 'development') {
        expect(connection.request.url).toEqual('http://localhost:3000/api/paypal/pay');
      } else {
        expect(connection.request.url).toEqual('https://bee-companion.com/api/paypal/pay');
      }
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      expect(JSON.parse(connection.request.getBody())).toEqual(
        {
          receiverEmail: 'beekeeper.pp@beecompanion.com',
          amount: 15.00,
        }
      );

      let OPTS = new ResponseOptions({
        body: fakePaypalAdaptivePaymentResponse
      });

      connection.mockRespond(new Response(OPTS));
    });

    paypalService.executeAdaptivePayment('beekeeper.pp@beecompanion.com', 15.00).subscribe(() => {
      done();
    });
  });

  it('executeAdaptivePayment should return json response with proper properties and values',
    (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let OPTS = new ResponseOptions({
          body: fakePaypalAdaptivePaymentResponse
        });

        connection.mockRespond(new Response(OPTS));
      });

      paypalService.executeAdaptivePayment('beekeeper.pp@beecompanion.com', 15.00).subscribe((response) => {
        expect(response.responseEnvelope.timestamp).toBeDefined();
        expect(response.responseEnvelope.ack).toEqual('Success');
        expect(response.responseEnvelope.correlationId).toBeDefined();
        expect(response.responseEnvelope.build).toBeDefined();
        expect(response.payKey).toBeDefined();
        expect(response.paymentExecStatus).toEqual('CREATED');
        expect(response.httpStatusCode).toEqual(200);
        expect(response.paymentApprovalUrl).toBeDefined();
        done();
      });
    });

  it('executeAdaptivePayment should call console.error when requesting payment details fails', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      const OPTS: any = new ResponseOptions({
        body: { error: 'Some error occured!' },
        status: 404
      });
      const response: any = new Response(OPTS);
      connection.mockError(response);
    });

    spyOn(console, 'error');

    paypalService.executeAdaptivePayment('beekeeper.pp@beecompanion.com', 15.00).subscribe((response) => {
      console.log(response); // Object{error: 'Some strange error'}
    }, () => {
      expect(console.error).toHaveBeenCalledWith('404 -  Some error occured!');
    });
    done();
  });

  it('getPaymentDetails should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      if (process.env === 'development') {
        expect(connection.request.url).toEqual('http://localhost:3000/api/paypal/pay/payment-details');
      } else {
        expect(connection.request.url).toEqual('https://bee-companion.com/api/paypal/pay/payment-details');
      }
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      expect(JSON.parse(connection.request.getBody())).toEqual(
        {
          payKey: 'AP-45A19953MH4156941'
        }
      );

      let OPTS = new ResponseOptions({
        body: fakePaypalAdaptivePaymentDetailsResponse
      });

      connection.mockRespond(new Response(OPTS));
    });

    paypalService.getPaymentDetails('AP-45A19953MH4156941').subscribe(() => {
      done();
    });
  });

  it('getPaymentDetails should return json response with proper properties and values', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      let OPTS = new ResponseOptions({
        body: fakePaypalAdaptivePaymentDetailsResponse
      });

      connection.mockRespond(new Response(OPTS));
    });

    paypalService.getPaymentDetails('AP-45A19953MH4156941').subscribe((response) => {
      expect(response.responseEnvelope.timestamp).toBeDefined();
      expect(response.responseEnvelope.ack).toEqual('Success');
      expect(response.responseEnvelope.correlationId).toBeDefined();
      expect(response.responseEnvelope.build).toBeDefined();
      if (process.env === 'development') {
        expect(response.cancelUrl).toEqual('http://localhost:3000/api/paypal/pay/cancelled');
        expect(response.returnUrl).toEqual('http://localhost:3000/api/paypal/pay/approved');
      } else {
        expect(response.cancelUrl).toEqual('https://bee-companion.com/api/paypal/pay/cancelled');
        expect(response.returnUrl).toEqual('https://bee-companion.com/api/paypal/pay/approved');
      }
      expect(response.currencyCode).toEqual('EUR');
      expect(response.paymentInfoList.paymentInfo[0].transactionId).toBeDefined();
      expect(response.paymentInfoList.paymentInfo[0].transactionStatus).toEqual('COMPLETED');
      expect(response.paymentInfoList.paymentInfo[0].receiver.amount).toBeDefined();
      expect(response.paymentInfoList.paymentInfo[0].receiver.email).toBeDefined();
      expect(response.paymentInfoList.paymentInfo[0].receiver.primary).toBeDefined();
      expect(response.paymentInfoList.paymentInfo[0].receiver.paymentType).toEqual('SERVICE');
      expect(response.paymentInfoList.paymentInfo[0].receiver.accountId).toBeDefined();
      expect(response.paymentInfoList.paymentInfo[0].transactionStatus).toBeDefined();
      expect(response.paymentInfoList.paymentInfo[0].refundedAmount).toEqual(0.00);
      expect(response.paymentInfoList.paymentInfo[0].pendingRefund).toEqual(false);
      expect(response.paymentInfoList.paymentInfo[0].senderTransactionId).toBeDefined();
      expect(response.paymentInfoList.paymentInfo[0].senderTransactionStatus).toBeDefined();
      expect(response.senderEmail).toBeDefined();
      expect(response.status).toEqual('COMPLETED');
      expect(response.payKey).toBeDefined();
      expect(response.actionType).toEqual('PAY');
      expect(response.feesPayer).toEqual('EACHRECEIVER');
      expect(response.reverseAllParallelPaymentsOnError).toEqual(false);
      expect(response.sender.email).toBeDefined();
      expect(response.sender.accountId).toBeDefined();
      expect(response.sender.useCredentials).toEqual(false);
      expect(response.httpStatusCode).toEqual(200);
      done();
    });
  });

  it('getPaymentDetails should call console.error when requesting payment details fails', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      const OPTS: any = new ResponseOptions({
        body: { error: 'Some error occured!' },
        status: 404
      });
      const response: any = new Response(OPTS);
      connection.mockError(response);
    });

    spyOn(console, 'error');

    paypalService.getPaymentDetails('AP-45A19953MH4156941').subscribe((response) => {
      console.log(response); // Object{error: 'Some strange error'}
    }, () => {
      expect(console.error).toHaveBeenCalledWith('404 -  Some error occured!');
    });
    done();
  });

  it('storePaymentDetailsInDatabase should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      if (process.env === 'development') {
        expect(connection.request.url).toEqual('http://localhost:3000/api/paypaltransaction/create');
      } else {
        expect(connection.request.url).toEqual('https://bee-companion.com/api/paypaltransaction/create');
      }
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');

      let OPTS = new ResponseOptions({
        body: fakeStorePaymentDetailsInDatabaseResponse
      });

      connection.mockRespond(new Response(OPTS));
    });

    paypalService.storePaymentDetailsInDatabase(fakePaypalAdaptivePaymentDetailsResponse).subscribe(() => {
        done();
    });
  });

  it('storePaymentDetailsInDatabase should return json response with proper properties and values',
    (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let OPTS = new ResponseOptions({
          body: fakeStorePaymentDetailsInDatabaseResponse
        });

        connection.mockRespond(new Response(OPTS));
      });

      paypalService.storePaymentDetailsInDatabase(fakePaypalAdaptivePaymentDetailsResponse).subscribe((response) => {
        expect(response).toEqual(fakeStorePaymentDetailsInDatabaseResponse);
        done();
      });
  });

  it('storePaymentDetailsInDatabase should call console.error when database storing fails', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      const OPTS: any = new ResponseOptions({
        body: { error: 'Some error occured!' },
        status: 404
      });
      const response: any = new Response(OPTS);
      connection.mockError(response);
    });

    spyOn(console, 'error');

    paypalService.storePaymentDetailsInDatabase(fakePaypalAdaptivePaymentDetailsResponse).subscribe((response) => {
      console.log(response); // Object{error: 'Some strange error'}
    }, () => {
      expect(console.error).toHaveBeenCalledWith('404 -  Some error occured!');
    });
    done();
  });
});
