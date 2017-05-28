import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

@Component({
  selector: 'no-content',
  styleUrls: [ './no-content.component.scss' ],
  templateUrl: './no-content.component.html',
})
export class NoContentComponent implements OnInit {
  constructor(public titleService: Title) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.NoContentComponent);
  }
}
