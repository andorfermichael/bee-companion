import {
  TestBed,
  inject
} from '@angular/core/testing';
import {
  Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { PayPalService } from './paypal.service';

describe('PayPalService', () => {
  let subject: PayPalService;
  let backend: MockBackend;
  let paypalAdaptivePaymentResponse = {
    responseEnvelope:
      {
        timestamp: "2017-05-13T10:36:57.307-07:00",
        ack: "Success",
        correlationId: "55958871e6806",
        build: "32250686"
      },
      payKey: "AP-45A19953MH4156941",
      paymentExecStatus: "CREATED",
      httpStatusCode: 200,
      paymentApprovalUrl: "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=AP-45A19953MH4156941"
  };
  let paypalAdaptivePaymentDetailsResponse = {
    responseEnvelope: {
      timestamp: "2017-05-19T08:02:17.853-07:00",
      ack: "Success",
      correlationId: "f5ba559dd972c",
      build: "32250686"
    },
    cancelUrl: "http://localhost:3000/api/paypal/pay/cancelled",
    currencyCode: "EUR",
    paymentInfoList: {
      paymentInfo: [{
        transactionId: "5CL981702V8930202",
        transactionStatus: "COMPLETED",
        receiver: {
          amount: 1.00,
          email: "beekeeper.pp@beecompanion.com",
          primary: false,
          paymentType: "SERVICE",
          accountId: "CU9RFC9CEK5C4"
        },
        refundedAmount: 0.00,
        pendingRefund: false,
        senderTransactionId: "9K210475363581720",
        senderTransactionStatus: "COMPLETED"
      }]
    },
    returnUrl: "http://localhost:3000/api/paypal/pay/approved",
    senderEmail: "supporter.pp@beecompanion.com",
    status: "COMPLETED",
    payKey: "AP-1VR17193BV163813X",
    actionType: "PAY",
    feesPayer: "EACHRECEIVER",
    reverseAllParallelPaymentsOnError: false,
    sender: {
      email: "supporter.pp@beecompanion.com",
      accountId: "AD99B6LNWBMEQ",
      useCredentials: false
    },
    httpStatusCode: 200
  };
  let storePaymentDetailsInDatabase = {
    body: `
      { receiverEmail: 'beekeeper.pp@beecompanion.com',amount: '1.44' }
      Executing (default): INSERT INTO "PaypalTransactions" 
      ("id","responseEnvelopeTimestamp","responseEnvelopeAck",
      "responseEnvelopeCorrelationId","responseEnvelopeBuild",
      "currencyCode","transactionId","transactionStatus","receiverAmount",
      "receiverEmail","receiverPrimary","receiverPaymentType","receiverAccountId",
      "refundedAmount","pendingRefund","senderTransactionId","senderTransactionStatus",
      "status","payKey","feesPayer","senderEmail","senderAccountId","createdAt","updatedAt")
       VALUES (DEFAULT,'2017-05-20 13:52:28.518 +00:00','Success','b4f2d1d3a48b5','32250686',
       'EUR','9KY46005SL237225G','COMPLETED','1.44','beekeeper.pp@beecompanion.com',false,
       'SERVICE','CU9RFC9CEK5C4','0.00',false,'96664611WM680425F','COMPLETED','COMPLETED',
       'AP-1FS21599907287639','EACHRECEIVER','supporter.pp@beecompanion.com','AD99B6LNWBMEQ',
       '2017-05-20 13:52:28.757 +00:00','2017-05-20 13:52:28.757 +00:00') RETURNING *;`
  };

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

  beforeEach(inject([PayPalService, MockBackend], (payPalFormService, mockBackend) => {
    subject = payPalFormService;
    backend = mockBackend;
  }));

  it('executeAdaptivePayment should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual('http://localhost:3000/api/paypal/pay');
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      expect(JSON.parse(connection.request.getBody())).toEqual(
        {
          receiverEmail: 'beekeeper.pp@beecompanion.com',
          amount: 15.00,
        }
      );

      let options = new ResponseOptions({
        body: paypalAdaptivePaymentResponse
      });

      connection.mockRespond(new Response(options));
    });

    subject.executeAdaptivePayment('beekeeper.pp@beecompanion.com', 15.00).subscribe(() => {
      done();
    });
  });

  it('executeAdaptivePayment should return json response with proper properties and values',
    (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: paypalAdaptivePaymentResponse
        });

        connection.mockRespond(new Response(options));
      });

      subject.executeAdaptivePayment('beekeeper.pp@beecompanion.com', 15.00).subscribe((response) => {
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

  it('getPaymentDetails should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual('http://localhost:3000/api/paypal/pay/payment-details');
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      expect(JSON.parse(connection.request.getBody())).toEqual(
        {
          payKey: 'AP-45A19953MH4156941'
        }
      );

      let options = new ResponseOptions({
        body: paypalAdaptivePaymentDetailsResponse
      });

      connection.mockRespond(new Response(options));
    });

    subject.getPaymentDetails('AP-45A19953MH4156941').subscribe(() => {
      done();
    });
  });

  it('getPaymentDetails should return json response with proper properties and values', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: paypalAdaptivePaymentDetailsResponse
      });

      connection.mockRespond(new Response(options));
    });

    subject.getPaymentDetails('AP-45A19953MH4156941').subscribe((response) => {
      expect(response.responseEnvelope.timestamp).toBeDefined();
      expect(response.responseEnvelope.ack).toEqual('Success');
      expect(response.responseEnvelope.correlationId).toBeDefined();
      expect(response.responseEnvelope.build).toBeDefined();
      expect(response.cancelUrl).toEqual('http://localhost:3000/api/paypal/pay/cancelled');
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
      expect(response.returnUrl).toEqual('http://localhost:3000/api/paypal/pay/approved');
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

  it('storePaymentDetailsInDatabase should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual('http://localhost:3000/api/paypaltransaction/create');
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');

      let options = new ResponseOptions({
        body: storePaymentDetailsInDatabase
      });

      connection.mockRespond(new Response(options));
    });

    subject.storePaymentDetailsInDatabase(paypalAdaptivePaymentDetailsResponse).subscribe(() => {
        done();
    });
  });

  it('storePaymentDetailsInDatabase should return json response with proper properties and values',
    (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: storePaymentDetailsInDatabase
        });

        connection.mockRespond(new Response(options));
      });

      subject.storePaymentDetailsInDatabase(paypalAdaptivePaymentDetailsResponse).subscribe((response) => {
        expect(response).toEqual(storePaymentDetailsInDatabase);
        done();
      });
  });
});
