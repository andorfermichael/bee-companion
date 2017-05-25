import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { SignupCardComponent } from '../../@elements/+signupCard/signupCard.component';

describe(`SignupCardComponent`, () => {
  let comp: SignupCardComponent;
  let fixture: ComponentFixture<SignupCardComponent>;
  let eventsService: EventsService;
  let authService: Auth;

  class MockAuth {
    public _updateProfile() {
      return true;
    }

    public loginWithGoogle(): void {
      return;
    }

    public loginWithFacebook(): void {
      return;
    }

    public login(username?: string, password?: string): Promise<any> {
      if (!username && !password) {
        return;
      }
      return this.processLogin(username, password);
    }

    private processLogin(username?: string, password?: string): Promise<any> {
      if (username == 'reject') {
        return Promise.reject('error');
      } else {
        return Promise.resolve();
      }
    }
  }

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SignupCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Auth, useClass: MockAuth }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(SignupCardComponent);
    comp = fixture.componentInstance;
    eventsService = TestBed.get(EventsService);
    authService = TestBed.get(Auth);
  });
});

