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
  let localStorageService: LocalStorageService;

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
    localStorageService = TestBed.get(LocalStorageService);
  });

  it('executeDonation should prepare payment using paypal service and return response with payment id on success', (done) => {
    fixture.detectChanges();
    const amount = 15.00;
    spyOn(paypalService, 'preparePayment').and.returnValue(Observable.of({id: 'PAY-91W1857156818772ULEZ43II'}));
    comp.executeDonation(amount);

    paypalService.preparePayment('beekeeper.pp@beecompanion.com', amount).subscribe((payment) => {
      fixture.detectChanges();
      expect(paypalService.preparePayment).toHaveBeenCalledWith(jasmine.any(String), amount);
      expect(payment.id).toEqual('PAY-91W1857156818772ULEZ43II');
      done();
    });
  });

  xit('executeDonation should execute adaptive payment using paypal service and log error ' +
    'if failed', async(() => {
    fixture.detectChanges();
    const amount = 15.00;
    spyOn(paypalService, 'preparePayment').and.returnValue(Observable.throw('error'));
    spyOn(console, 'error');
    comp.executeDonation(amount);

    paypalService.preparePayment('beekeeper.pp@beecompanion.com', amount).subscribe(
      (payment) => {
        // nothing
      },
      (error) => {
        fixture.detectChanges();
        expect(console.error).toHaveBeenCalled();
        expect(error).toBe('error');
      }
    );
  }));
});

