import { ActivatedRoute, Data } from '@angular/router';
import { inject, TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { BeeRadarComponent } from './beeRadar.component';

describe('About', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      // provide a better mock
      {
        provide: ActivatedRoute,
        useValue: {
          data: {
            subscribe: (fn: (value: Data) => void) => fn({
              yourData: 'yolo'
            })
          }
        }
      },
      BeeRadarComponent
    ]
  }));

  it('should log ngOnInit', inject([BeeRadarComponent], (beeradar: BeeRadarComponent) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    beeradar.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
