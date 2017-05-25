import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture} from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from "rxjs/Observable";

// Load the implementations that should be tested
import { LocalStorageService } from 'ngx-webstorage';
import { PayPalService } from '../../../@services/paypal.service';
import { PayPalFormComponent } from '../../../@elements/+paypalForm/paypalForm.component';

describe(`PayPalFormComponent`, () => {
  let comp: PayPalFormComponent;
  let fixture: ComponentFixture<PayPalFormComponent>;
  let paypalService: PayPalService;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PayPalFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        LocalStorageService,
        PayPalService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(PayPalFormComponent);
    comp = fixture.componentInstance;
    paypalService = TestBed.get(PayPalService);
  });

  xit('executeDonation should execute adaptive payment using paypal service ', async(() => {
    spyOn(paypalService, 'executeAdaptivePayment').and.returnValue(Observable.of('some value'));
    comp.executeDonation(15.00);
    fixture.whenStable().then(() => {
      expect(paypalService.executeAdaptivePayment).toHaveBeenCalled();
    })
  }));
});

