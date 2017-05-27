import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';
import { Auth } from '../../@services/auth.service';

@Component({
  selector: 'restricted',
  styleUrls: [ './restricted.component.scss' ],
  templateUrl: './restricted.component.html'
})
export class RestrictedComponent implements OnInit {
  constructor(private titleService: Title, public auth: Auth) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.RestrictedComponent);
  }
}
