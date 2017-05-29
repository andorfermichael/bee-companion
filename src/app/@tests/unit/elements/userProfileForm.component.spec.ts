import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';

// Load the implementations that should be tested
import { Auth } from '../../../@services/auth.service';
import { EventsService } from '../../../@services/events.service';
import { UserProfileFormComponent } from '../../../@elements/+userProfileForm/userProfileForm.component';

import { MockAuthService } from '../_doubles/auth.doubles'

describe(`UserProfileFormComponent`, () => {
  let comp: UserProfileFormComponent;
  let fixture: ComponentFixture<UserProfileFormComponent>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [UserProfileFormComponent],
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
    fixture = TestBed.createComponent(UserProfileFormComponent);
    comp = fixture.componentInstance;
  });
});

