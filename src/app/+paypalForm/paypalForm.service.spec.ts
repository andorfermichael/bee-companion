import {
  TestBed,
  inject
} from '@angular/core/testing';
import {
  Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { PayPalFormService } from './paypalForm.service';

import querystring = require('querystring');

describe('PayPalFormService', () => {
  let subject: PayPalFormService;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayPalFormService,
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

  beforeEach(inject([PayPalFormService, MockBackend], (payPalFormService, mockBackend) => {
    subject = payPalFormService;
    backend = mockBackend;
  }));

  it('should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual('http://localhost:3000/api/paypal/pay');
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
      expect(querystring.parse(connection.request.getBody())).toEqual(
        {
          receiverMail: 'beekeeper.pp@beecompanion.com',
          amount: '15.00',
        }
      );

      let options = new ResponseOptions({
        body: paypalAdaptivePaymentResponse
      });

      connection.mockRespond(new Response(options));
    });

    subject.executeAdaptivePayment('beekeeper.pp@beecompanion.com', '15.00').subscribe((response) => {
      done();
    });
  });

  it('should return json response with proper properties', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: paypalAdaptivePaymentResponse
      });

      connection.mockRespond(new Response(options));
    });

    subject.executeAdaptivePayment('beekeeper.pp@beecompanion.com', '15.00').subscribe((response) => {
      expect(paypalAdaptivePaymentResponse.responseEnvelope.timestamp).toBeDefined();
      expect(paypalAdaptivePaymentResponse.responseEnvelope.ack).toEqual('Success');
      expect(paypalAdaptivePaymentResponse.responseEnvelope.correlationId).toBeDefined();
      expect(paypalAdaptivePaymentResponse.responseEnvelope.build).toBeDefined();
      expect(paypalAdaptivePaymentResponse.payKey).toBeDefined();
      expect(paypalAdaptivePaymentResponse.paymentExecStatus).toEqual('CREATED');
      expect(paypalAdaptivePaymentResponse.httpStatusCode).toEqual(200);
      expect(paypalAdaptivePaymentResponse.paymentApprovalUrl).toBeDefined();
      done();
    });
  });
});
