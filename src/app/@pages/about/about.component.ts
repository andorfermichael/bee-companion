import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

@Component({
  selector: 'aboutUs',
  styleUrls: [ './about.component.scss' ],
  templateUrl: './about.component.html'
})
export class AboutUsComponent implements OnInit {
  constructor(private titleService: Title) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.AboutComponent);
  }
}
