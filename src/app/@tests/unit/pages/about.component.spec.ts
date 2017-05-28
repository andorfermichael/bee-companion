import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { AboutUsComponent } from '../../../@pages/about/about.component';

describe(`AboutUsComponent`, () => {
  let comp: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  let titleService: Title;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsComponent);
    comp = fixture.componentInstance;
    titleService = TestBed.get(Title);
  });

  it('ngOnInit should set page title', () => {
    spyOn(titleService, 'setTitle');
    comp.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalled();
  });
});
