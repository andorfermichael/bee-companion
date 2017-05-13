import { Component } from '@angular/core';

import { PayPalFormService } from './paypalForm.service';

@Component({
  selector: 'paypalForm',
  styleUrls: [ './paypalForm.component.scss' ],
  templateUrl: './paypalForm.component.html',
  providers: [
    PayPalFormService
  ]
})
export class PayPalFormComponent {
  constructor(private paypalFormService: PayPalFormService) {
  }

  public executeDonation(receiverMail: string, amount: string) {
    this.paypalFormService.executeAdaptivePayment(receiverMail, amount).subscribe(
      (payment) => {
        window.open(payment.paymentApprovalUrl);
      },
      (err) => {
        console.log(err);
      });
  }
}
