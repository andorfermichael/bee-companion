import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { LoginPageComponent } from '../../../@pages/login/login.component';
import {RouterTestingModule} from "@angular/router/testing";

describe(`LoginPageComponent`, () => {
  let comp: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let titleService: Title;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LoginPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    comp = fixture.componentInstance;
    titleService = TestBed.get(Title);
  });

  it('ngOnInit should set page title', () => {
    spyOn(titleService, 'setTitle');
    comp.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalled();
  });
});
