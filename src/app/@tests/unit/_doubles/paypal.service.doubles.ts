import { Observable } from 'rxjs/Observable';

export class MockPayPalService {
  public getPaymentDetails(payKey): Observable<any> {
    if (payKey === 'Error') {
      return Observable.throw({});
    } else {
      return Observable.of({});
    }
  }

  public storePaymentDetailsInDatabase(payment: any): Observable<any> {
    if (payment === 'Error') {
      return Observable.throw({});
    } else {
      return Observable.of({});
    }
  }
}

export const FakePaypalPreparePaymentResponse = {
  id: 'PAY-91W1857156818772ULEZ43II',
  intent: 'authorize',
  state: 'created',
  payer: {
    payment_method: 'paypal'
  },
  transactions: [{
    amount: {
      currency: 'EUR',
      total: 15.00
    },
    payee: {
      email: 'beekeeper.pp@beecompanion.com'
    },
    description: 'Donation',
    item_list: {
      items: [{
        name: 'donation to beekeeper',
        sku: 'donation',
        price: 15.00,
        currency: 'EUR',
        quantity: 1
      }]
    },
    related_resources: []
  }],
  create_time: '2017-06-04T09:06:41Z',
  links: [{
    href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-91W1857156818772ULEZ43II',
    rel: 'self',
    method: 'GET'
  },
  {
    href: 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-0Y175173VD261171B',
    rel: 'approval_url',
    method: 'REDIRECT'
  },
  {
    href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-91W1857156818772ULEZ43II/execute',
    rel: 'execute',
    method: 'POST'
  }],
  httpStatusCode: 201
};

export const FakePaypalExecutePaymentResponse = {
  id: 'PAY-8V631080519529720LEZMZHI',
  intent: 'authorize',
  state: 'approved',
  cart: '96812445YU595874G',
  payer: {
  payment_method: 'paypal',
    payer_info: {
    email: 'supporter.pp@beecompanion.com',
      first_name: 'Sepp',
      last_name: 'Supporter',
      payer_id: 'AD99B6LNWBMEQ',
      shipping_address: {
      recipient_name: 'Sepp Supporter',
        line1: 'Weingartenweg 1',
        line2: 'Rafing',
        city: 'PULKAU',
        state: '',
        postal_code: '3741',
        country_code: 'AT'
      },
      country_code: 'AT'
    }
  },
  transactions: [{
    amount: {
      total: 1.00,
      currency: 'EUR',
      details: {}
    },
    description: 'Donation',
    item_list: {
      items: [{
        name: 'donation to beekeeper',
        sku: 'donation',
        price: 1.00,
        currency: 'EUR',
        quantity: 1
      }],
      shipping_address: {
        line1: 'Weingartenweg 1',
        line2: 'Rafing',
        city: 'PULKAU',
        state: '',
        postal_code: '3741',
        country_code: 'AT'
      }
    },
    related_resources: [{
      authorization: {
        id: '4PS47107NY6995701',
        state: 'authorized',
        amount: {
          total: 1.00,
          currency: 'EUR',
          details: {}
        },
        payment_mode: 'INSTANT_TRANSFER',
        reason_code: 'AUTHORIZATION',
        protection_eligibility: 'ELIGIBLE',
        protection_eligibility_type: 'ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE',
        parent_payment: 'PAY-8V631080519529720LEZMZHI',
        valid_until: '2017-07-02T14:51:21Z',
        create_time: '2017-06-03T14:51:21Z',
        update_time: '2017-06-03T14:51:21Z',
        links: [{
            href: 'https://api.sandbox.paypal.com/v1/payments/authorization/4PS47107NY6995701',
            rel: 'self',
            method: 'GET'
          }, {
            href: 'https://api.sandbox.paypal.com/v1/payments/authorization/4PS47107NY6995701/capture',
            rel: 'capture',
            method: 'POST'
          }, {
            href: 'https://api.sandbox.paypal.com/v1/payments/authorization/4PS47107NY6995701/void',
            rel: 'void',
            method: 'POST'
          }, {
            href: 'https://api.sandbox.paypal.com/v1/payments/authorization/4PS47107NY6995701/reauthorize',
            rel: 'reauthorize',
            method: 'POST'
          }, {
            href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-8V631080519529720LEZMZHI',
            rel: 'parent_payment',
            method: 'GET'
        }]
      }
    }]
  }],
  create_time: '2017-06-03T14:51:21Z',
  links: [{
    href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-8V631080519529720LEZMZHI',
    rel: 'self',
    method: 'GET'
  }],
  httpStatusCode: 200
};

export const FakeStorePaymentDetailsInDatabaseResponse = {
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
