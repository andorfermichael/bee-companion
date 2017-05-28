import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { ImageRatioComponent } from '../../../@elements/+imageRatio/imageRatio.component';
import { Auth } from '../../../@services/auth.service';

import { MockAuthService } from '../_doubles/auth.doubles'

describe('ImageRatioComponent', () => {
  let comp: ImageRatioComponent;
  let fixture: ComponentFixture<ImageRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageRatioComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Auth, useClass: MockAuthService }
      ]
    })
    .compileComponents() // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(ImageRatioComponent);
    comp = fixture.componentInstance;
  });

  it('ngOnInit should set "imgSrc" if url was given', () => {
    const url = 'https://example.png';
    comp.url = url;
    comp.ngOnInit();
    expect(comp.imgSrc).toEqual(`url('${url}')`);
  });

  it('ngOnInit should log error and return if no url was set', () => {
    spyOn(console, 'error');
    const url = null;
    comp.url = url;
    comp.ngOnInit();
    expect(console.error).toHaveBeenCalled();
  });

  it('ngOnChanges should set "imgSrc" if url was given', () => {
    const url = 'https://example.png';
    comp.url = url;
    comp.ngOnChanges();
    expect(comp.imgSrc).toEqual(`url('${url}')`);
  });

  it('ngOnChanges should log error and return if no url was set', () => {
    spyOn(console, 'error');
    const url = null;
    comp.url = url;
    comp.ngOnChanges();
    expect(console.error).toHaveBeenCalled();
  });

  it('ngOnDestroy should set "imgSrc" to null', () => {
    comp.ngOnDestroy();
    expect(comp.imgSrc).toEqual(null);
  });
});
