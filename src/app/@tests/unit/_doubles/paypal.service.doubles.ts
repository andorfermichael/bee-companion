import { Observable } from 'rxjs/Observable';

export class MockPayPalService {
  public getPaymentDetails(payKey): Observable<any> {
    console.log(payKey);
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

export const fakePaypalAdaptivePaymentResponse = {
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

export const fakePaypalAdaptivePaymentDetailsResponse = {
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

export const fakeStorePaymentDetailsInDatabaseResponse = {
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
