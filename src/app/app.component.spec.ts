import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async,  TestBed,  ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, Http, XHRBackend } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';

// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { Auth } from './@services/auth.service';

// Mock our Auth service
export class MockAuth0 {
  public handleAuth(): void {
    return;
  }
}

describe(`App`, () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [ AppComponent ],
        imports: [RouterTestingModule, HttpModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
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
      .overrideComponent(AppComponent, {
        set: {
          providers: [{ provide: Auth, useValue: new MockAuth0() }]
        }
      })
      .compileComponents();

  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp    = fixture.componentInstance;

    fixture.detectChanges(); // trigger initial data binding
  });

  it(`should be readly initialized`, () => {
    expect(fixture).toBeDefined();
    expect(comp).toBeDefined();
  });

  it(`should be BeeCompanion`, () => {
    expect(comp.url).toEqual('https://www.bee-companion.com/');
    expect(comp.angularclassLogo).toEqual('assets/img/BeeCompanion_smallLogo.png');
    expect(comp.name).toEqual('BeeCompanion');
  });
});
