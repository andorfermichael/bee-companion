import { Injectable } from '@angular/core';
const PayPalAdaptiveLib = require('paypal-adaptive');

@Injectable()
export class PayPalAdaptive {
  private paypal;

  constructor() {
    this.paypal = PayPalAdaptiveLib;
  }

  public getSDK() {
    return this.paypal;
  }
}
