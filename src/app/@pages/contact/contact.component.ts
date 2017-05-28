import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

@Component({
  selector: 'contactUs',
  styleUrls: [ './contact.component.scss' ],
  templateUrl: './contact.component.html'
})
export class ContactUsComponent implements OnInit {
  constructor(public titleService: Title) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.ContactComponent);
  }
}
