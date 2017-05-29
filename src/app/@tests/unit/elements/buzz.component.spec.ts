import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';

// Load the implementations that should be tested
import { Auth } from '../../../@services/auth.service';
import { EventsService } from '../../../@services/events.service';
import { SingleBuzzComponent } from '../../../@elements/+buzz/buzz.component';

import { MockAuthService } from '../_doubles/auth.doubles'

describe(`BuzzComponent`, () => {
  let comp: SingleBuzzComponent;
  let fixture: ComponentFixture<SingleBuzzComponent>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [SingleBuzzComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EventsService,
        { provide: Auth, useClass: MockAuthService }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(SingleBuzzComponent);
    comp = fixture.componentInstance;
  });
});

