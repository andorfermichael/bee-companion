import { TestBed, async } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { GeolocationService } from '../../../@services/geolocation.service';

describe('GeolocationService', () => {
  let geolocationService: GeolocationService;
  let mockBackend : MockBackend;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        GeolocationService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (mockBackend, defaultOptions) => {
            return new Http(mockBackend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    })
  }));

  // synchronous beforeEach
  beforeEach(() => {
    geolocationService = TestBed.get(GeolocationService);
    mockBackend = TestBed.get(MockBackend);
  });

/*  xit('getLocation getLocation', (done) => {
    //fixture.detectChanges();
    const amount = 15.00;
    spyOn(geolocationService, 'executeAdaptivePayment').and.returnValue(Observable.of({payKey: 'AP-12345'}));
    comp.executeDonation(amount);

    paypalService.executeAdaptivePayment('beekeeper.pp@beecompanion.com', amount).subscribe((payment) => {
      fixture.detectChanges();
      expect(paypalService.executeAdaptivePayment).toHaveBeenCalledWith(jasmine.any(String), amount);
      expect(payment.payKey).toEqual('AP-12345');
      done();
    });
  });*/

  xit('getLocation getLocation ', (done) => {
/*    mockBackend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: { coords: { latitude: 32, longitude: -96 } }
      });

      connection.mockRespond(new Response(options));
    });
    geolocationService.getLocation({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }).subscribe(result => {
      expect(result).toEqual({ coords: { latitude: 32, longitude: -96 } });
      done();
    });*/



    //geolocationService.getLocation({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    //expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(comp.processLocation, comp.locationError);
  });
});
