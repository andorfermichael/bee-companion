import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

@Component({
  selector: 'termsAndConditions',
  styleUrls: [ './terms.component.scss' ],
  templateUrl: './terms.component.html'
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private titleService: Title) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.TermsComponent);
  }
}
