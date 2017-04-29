import { ActivatedRoute, Data } from '@angular/router';
import { inject, TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { PrivacyPolicyComponent } from './privacy.component';

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
      PrivacyPolicyComponent
    ]
  }));

  it('should log ngOnInit', inject([PrivacyPolicyComponent], (privacy: PrivacyPolicyComponent) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    privacy.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
