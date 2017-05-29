import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, Http, XHRBackend } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';

// Load the implementations that should be tested
import { MockAngularGoogleMapsComponent } from '../_doubles/google-maps.doubles';
import { MarkerClusterDirective } from '../../../@directives/marker-cluster.directive';

xdescribe(`MarkerClusterDirective`, () => {
  let comp: MockAngularGoogleMapsComponent;
  let fixture: ComponentFixture<MockAngularGoogleMapsComponent>;
  let markerClusterDirective: MarkerClusterDirective;

  // async beforeEach
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [ MockAngularGoogleMapsComponent, MarkerClusterDirective ],
        imports: [RouterTestingModule, HttpModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          GoogleMapsAPIWrapper,
          MapsAPILoader,
          MarkerClusterDirective,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
          }
        ]
      })
      .overrideComponent(MockAngularGoogleMapsComponent, {
        set: {
          template: '<div mock-agm></div>'
        }
      })
      .compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(MockAngularGoogleMapsComponent);
    comp    = fixture.componentInstance;
    markerClusterDirective = TestBed.get(MarkerClusterDirective);
  });

  it(`should`, () => {
    const directiveEl = fixture.debugElement.query(By.directive(MarkerClusterDirective));
    expect(directiveEl).not.toBeNull();
  });
});
