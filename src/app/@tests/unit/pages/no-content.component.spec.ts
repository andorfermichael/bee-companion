import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { NoContentComponent } from '../../../@pages/no-content/no-content.component';

describe(`NoContentComponent`, () => {
  let comp: NoContentComponent;
  let fixture: ComponentFixture<NoContentComponent>;
  let titleService: Title;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(NoContentComponent);
    comp = fixture.componentInstance;
    titleService = TestBed.get(Title);
  });

  it('ngOnInit should set page title', () => {
    spyOn(titleService, 'setTitle');
    comp.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalled();
  });
});
