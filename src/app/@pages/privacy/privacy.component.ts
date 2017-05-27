import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

@Component({
  selector: 'privacyPolicy',
  styleUrls: [ './privacy.component.scss' ],
  templateUrl: './privacy.component.html'
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(private titleService: Title) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.PrivacyComponent);
  }
}
