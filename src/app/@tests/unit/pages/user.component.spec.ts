import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthHttp} from 'angular2-jwt';

import { Auth } from '../../../@services/auth.service';
import { UserPageComponent } from '../../../@pages/user/userPage.component';

import { MockAuthService } from '../_doubles/auth.doubles';
import { ActivatedRouteStub } from '../_doubles/router.doubles';

describe(`UserPageComponent`, () => {
  let comp: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let titleService: Title;
  let activatedRoute: ActivatedRouteStub;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title,
        AuthHttp,
        { provide: Auth, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    comp = fixture.componentInstance;
    titleService = TestBed.get(Title);
  });

  it('ngOnInit should set page title', () => {
    spyOn(titleService, 'setTitle');
    comp.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalled();
  });
});
