import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { HeaderComponent } from './header.component';
import { NavComponent } from '../+nav/nav.component';
import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';

describe('HeaderComponent', () => {
  let comp: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderComponent, NavComponent],
      providers: [
        EventsService,
        LocalStorageService,
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
    fixture = TestBed.createComponent(HeaderComponent);
    comp = fixture.componentInstance;
  });

  it('enableNavigatorLocation should call navigator.geolocation.getCurrentPosition with success and error methods as arguments', () => {
    spyOn(navigator.geolocation, 'getCurrentPosition');
    comp.enableNavigatorLocation();
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(comp.processLocation, comp.locationError);
  });

  it('processLocation should set lat and long to given lat and long', () => {
    const position = { coords: { latitude: 32, longitude: -96 } };
    comp.processLocation(position);

    expect(comp.lat).toEqual(position.coords.latitude);
    expect(comp.lng).toEqual(position.coords.longitude);
  });

  it('processLocation should set message type to "success" and success information message', () => {
    const position = { coords: { latitude: 32, longitude: -96 } };
    comp.processLocation(position);

    expect(comp.messageType).toEqual('success');
    expect(comp.message).toEqual('You successfully granted us retrieving your location to enhance your experience with BeeCompanion.');
  });

  it('processLocation should set message type to "danger" and error information message', () => {
    comp.locationError();

    expect(comp.messageType).toEqual('danger');
    expect(comp.message).toEqual('Unfortunately we could not acquire your location which is recommended ' +
      'for best user experience with our service.');
  });
});
