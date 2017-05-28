import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Auth } from '../../../@services/auth.service';

import { RestrictedComponent } from '../../../@pages/restricted/restricted.component';

import { MockAuthService } from '../_doubles/auth.doubles';

describe(`RestrictedComponent`, () => {
  let comp: RestrictedComponent;
  let fixture: ComponentFixture<RestrictedComponent>;
  let titleService: Title;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestrictedComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title,
        { provide: Auth, useClass: MockAuthService }
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictedComponent);
    comp = fixture.componentInstance;
    titleService = TestBed.get(Title);
  });

  it('ngOnInit should set page title', () => {
    spyOn(titleService, 'setTitle');
    comp.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalled();
  });
});
