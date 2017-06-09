import { Component, Input } from '@angular/core';

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
  @Input() public username: string;

  constructor(public paypalService: PayPalService, public localStorage: LocalStorageService) {}

  public executeDonation(username: string, amount: number): void {
    // TODO: Replace email with email from profile page owner (real receiver)
    this.paypalService.preparePayment(username, amount).subscribe(
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
