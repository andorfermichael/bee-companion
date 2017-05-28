import { NO_ERRORS_SCHEMA} from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { BeeRadarComponent } from '../../../@pages/beeRadar/beeRadar.component';
import { LocalStorageService } from 'ngx-webstorage';
import { EventsService } from '../../../@services/events.service';
import { GeolocationService } from '../../../@services/geolocation.service';

describe(`BeeRadarComponent`, () => {
  let comp: BeeRadarComponent;
  let fixture: ComponentFixture<BeeRadarComponent>;
  let titleService: Title;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeeRadarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        Title,
        LocalStorageService,
        EventsService,
        GeolocationService
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(BeeRadarComponent);
    comp = fixture.componentInstance;
    titleService = TestBed.get(Title);
  });

  it('ngOnInit should set page title', () => {
    spyOn(titleService, 'setTitle');
    comp.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalled();
  });
});
