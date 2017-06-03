import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/switchMap';

import { Auth } from '../../@services/auth.service';
import { PayPalService } from '../../@services/paypal.service';
import { LocalStorageService } from 'ngx-webstorage';
import { EventsService } from '../../@services/events.service';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  providers: [
    PayPalService
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public headerIsToggled: boolean = false;
  public sub: any;
  public timeout: any;

  constructor(public titleService: Title, public paypalService: PayPalService, public auth: Auth,
              public route: ActivatedRoute, public location: Location,
              public localStorage: LocalStorageService, public _eventsService: EventsService) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.HomeComponent);

    if (this.auth.isAuthenticated()) {
      this.auth.checkUserHasRole();
      this.processPayments();
    }
  }

  public processPayments(): void {
      // Get payment status, approved or cancelled
      const paymentStatus = this.route.snapshot.params['status'];
      if (paymentStatus === 'approved') {
        const queryParams = this.route.snapshot.queryParams;

        // Get execute approved payment
        this.sub = this.paypalService.executePayment(queryParams.paymentId, queryParams.PayerID)
          .subscribe(
            (executedPaymentDetails) => {
              this.paypalService.storePaymentDetailsInDatabase(executedPaymentDetails).subscribe(
                () => {
                  // Remove state query param from url after a few seconds
                  this.timeout = setTimeout(() => {
                    this.location.replaceState('/home');
                  }, 4000);
                },
                (err) => {
                  console.error(err);
                });
            },
            (err) => {
              console.error(err);
            }
          );
      } else {
        // Remove state query param from url after a few seconds
        this.timeout = setTimeout(() => {
          this.location.replaceState('/home');
        }, 4000);
      }
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
