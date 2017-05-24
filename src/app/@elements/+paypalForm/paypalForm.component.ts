import { Component } from '@angular/core';

import { PayPalService } from '../../@services/paypal.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'paypalForm',
  styleUrls: [ './paypalForm.component.scss' ],
  templateUrl: './paypalForm.component.html',
  providers: [
    PayPalService
  ]
})
export class PayPalFormComponent {
  constructor(private paypalService: PayPalService, private localStorage: LocalStorageService) {}

  public executeDonation(amount: number) {
    // TODO: Replace email with email from profile page owner (real receiver)
    // TODO: Replace ids with real ids
    this.paypalService.executeAdaptivePayment('beekeeper.pp@beecompanion.com', amount).subscribe(
      (payment) => {
        // Store payment key for later use
        this.localStorage.store('lastPayKey', payment.payKey);

        // Redirect to approval url
        window.location.href = payment.paymentApprovalUrl;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
