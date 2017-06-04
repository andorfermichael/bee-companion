import { TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { PayPalService } from '../../../@services/paypal.service';

import {
  FakePaypalPreparePaymentResponse,
  FakePaypalExecutePaymentResponse,
  FakeStorePaymentDetailsInDatabaseResponse
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

  it('preparePayment should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      if (process.env === 'development') {
        expect(connection.request.url).toEqual('http://localhost:3000/api/paypal/payment/prepare');
      } else {
        expect(connection.request.url).toEqual('https://bee-companion.com/api/paypal/payment/prepare');
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
        body: FakePaypalPreparePaymentResponse
      });

      connection.mockRespond(new Response(OPTS));
    });

    paypalService.preparePayment('beekeeper.pp@beecompanion.com', 15.00).subscribe(() => {
      done();
    });
  });

  it('preparePayment should return json response with proper properties and values',
    (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: FakePaypalPreparePaymentResponse
        });

        connection.mockRespond(new Response(options));
      });

      paypalService.preparePayment('beekeeper.pp@beecompanion.com', 15.00).subscribe((response) => {
        expect(response.id).toBeDefined();
        expect(response.intent).toEqual('authorize');
        expect(response.state).toEqual('created');
        expect(response.payer.payment_method).toEqual('paypal');
        expect(response.transactions[0].amount.currency).toEqual('EUR');
        expect(response.transactions[0].amount.total).toEqual(15.00);
        expect(response.transactions[0].payee.email).toEqual('beekeeper.pp@beecompanion.com');
        done();
      });
    });

  xit('preparePayment should call console.error when requesting payment details fails', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      const options: any = new ResponseOptions({
        body: { error: 'Some error occured!' },
        status: 404
      });
      const response: any = new Response(options);
      connection.mockError(response);
    });

    spyOn(console, 'error');

    paypalService.preparePayment('beekeeper.pp@beecompanion.com', 1.00).subscribe((response) => {
      console.log(response); // Object{error: 'Some strange error'}
    }, () => {
      expect(console.error).toHaveBeenCalledWith('404 -  Some error occured!');
    });
    done();
  });

  it('executePayment should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      if (process.env === 'development') {
        expect(connection.request.url).toEqual('http://localhost:3000/api/paypal/payment/execute');
      } else {
        expect(connection.request.url).toEqual('https://bee-companion.com/api/paypal/payment/execute');
      }
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      expect(JSON.parse(connection.request.getBody())).toEqual(
        {
          paymentId: 'PAY-91W1857156818772ULEZ43II',
          payerId: 'AD99B6LNWBMEQ'
        }
      );

      let options = new ResponseOptions({
        body: FakePaypalExecutePaymentResponse
      });

      connection.mockRespond(new Response(options));
    });

    paypalService.executePayment('PAY-91W1857156818772ULEZ43II', 'AD99B6LNWBMEQ').subscribe(() => {
      done();
    });
  });

  it('executePayment should return json response with proper properties and values', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: FakePaypalExecutePaymentResponse
      });

      connection.mockRespond(new Response(options));
    });

    paypalService.executePayment('PAY-91W1857156818772ULEZ43II', 'AD99B6LNWBMEQ').subscribe((response) => {
      expect(response.id).toBeDefined();
      expect(response.intent).toEqual('authorize');
      expect(response.state).toEqual('approved');
      expect(response.payer.payment_method).toEqual('paypal');
      expect(response.transactions[0].amount.currency).toEqual('EUR');
      expect(response.transactions[0].amount.total).toEqual(1.00);
      done();
    });
  });

  xit('executePayment should call console.error when requesting payment details fails', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      const options: any = new ResponseOptions({
        body: { error: 'Some error occured!' },
        status: 404
      });
      const response: any = new Response(options);
      connection.mockError(response);
    });

    spyOn(console, 'error');

    paypalService.executePayment('PAY-91W1857156818772ULEZ43II', 'AD99B6LNWBMEQ').subscribe((response) => {
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

      let options = new ResponseOptions({
        body: FakeStorePaymentDetailsInDatabaseResponse
      });

      connection.mockRespond(new Response(options));
    });

    paypalService.storePaymentDetailsInDatabase(FakePaypalExecutePaymentResponse).subscribe(() => {
        done();
    });
  });

  it('storePaymentDetailsInDatabase should return json response with proper properties and values',
    (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: FakeStorePaymentDetailsInDatabaseResponse
        });

        connection.mockRespond(new Response(options));
      });

      paypalService.storePaymentDetailsInDatabase(FakePaypalExecutePaymentResponse).subscribe((response) => {
        expect(response).toEqual(FakeStorePaymentDetailsInDatabaseResponse);
        done();
      });
  });

  xit('storePaymentDetailsInDatabase should call console.error when database storing fails', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      const options: any = new ResponseOptions({
        body: { error: 'Some error occured!' },
        status: 404
      });
      const response: any = new Response(options);
      connection.mockError(response);
    });

    spyOn(console, 'error');

    paypalService.storePaymentDetailsInDatabase(FakePaypalExecutePaymentResponse).subscribe((response) => {
      console.log(response); // Object{error: 'Some strange error'}
    }, () => {
      expect(console.error).toHaveBeenCalledWith('404 -  Some error occured!');
    });
    done();
  });
});
