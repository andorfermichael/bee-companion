import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';

// Load the implementations that should be tested
import { Auth } from '../../../@services/auth.service';
import { EventsService } from '../../../@services/events.service';
import { UserProfileComponent } from '../../../@elements/+userProfile/userProfile.component';

import { MockAuthService } from '../_doubles/auth.doubles'

describe(`UserProfileComponent`, () => {
  let comp: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [UserProfileComponent],
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
    fixture = TestBed.createComponent(UserProfileComponent);
    comp = fixture.componentInstance;
  });
});

