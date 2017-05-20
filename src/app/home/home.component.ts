import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { Auth } from '../auth.service';
import { Title } from '../title';

import { PayPalService } from '../paypal.service';

import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  providers: [
    PayPalService
  ]
})
export class HomeComponent implements OnInit {
  constructor(private paypalService: PayPalService, public auth: Auth,
              private route: ActivatedRoute, private location: Location,
              private localStorage: LocalStorageService) {}

  public ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.checkUserHasRole();

      // Get payment status, approved or cancelled
      const paymentStatus = this.route.snapshot.params['status'];
      if (paymentStatus === 'approved') {
        // Get last pay key from local storage
        const lastPayKey = this.localStorage.retrieve('lastPayKey');

        // Get payment details from last payment
        this.paypalService.getPaymentDetails(lastPayKey).subscribe(
          (paymentDetails) => {
            this.paypalService.storePaymentDetailsInDatabase(paymentDetails).subscribe(
              (transaction) => {
                // Clear payment key from local storage
                this.localStorage.clear('lastPayKey');

                // Remove state query param from url after a few seconds
                setTimeout(() => {
                  this.location.replaceState('/home');
                }, 4000);
              },
              (err) => {
                console.log(err);
              });
          },
          (err) => {
            console.log(err);
          });
      } else {
        // Remove state query param from url after a few seconds
        setTimeout(() => {
          this.location.replaceState('/home');
        }, 4000);

        // If payment is cancelled, nothing has to be done, since pay keys are only valid for
        // three hours
      }
    }
  }
}
