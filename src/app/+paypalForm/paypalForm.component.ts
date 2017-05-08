import { Component } from '@angular/core';
import { PayPalAdaptive } from '../providers/paypal.provider';

@Component({
  selector: 'paypalForm',
  styleUrls: [ './paypalForm.component.scss' ],
  templateUrl: './paypalForm.component.html',
  providers: [ PayPalAdaptive ]
})
export class PayPalFormComponent {
  private paypalAdaptiveSDK: any;

  constructor(private paypalAdaptive: PayPalAdaptive) {
    this.paypalAdaptive = paypalAdaptive.getSDK();
  }

  public instantiatePayPalAdaptiveSDK(userId: string, password: string,
                                      signature: string, sandbox: boolean) {
    this.paypalAdaptiveSDK = new this.paypalAdaptiveSDK({
      userId,
      password,
      signature,
      sandbox // Defaults to false
    });
  }
}
