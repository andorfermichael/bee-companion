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
  constructor(public paypalService: PayPalService, public localStorage: LocalStorageService) {}

  public executeDonation(amount: number): void {
    // TODO: Replace email with email from profile page owner (real receiver)
    // TODO: Replace ids with real ids
    this.paypalService.preparePayment('beekeeper.pp@beecompanion.com', amount).subscribe(
      (payment) => {
        // Redirect to approval url
        window.location.href = payment.links[1].href;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
