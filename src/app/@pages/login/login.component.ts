import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PageTitlePrefix, PageTitles } from '../../@config/meta.config';

@Component({
  selector: 'loginPage',
  styleUrls: [ './login.component.scss' ],
  templateUrl: './login.component.html'
})
export class LoginPageComponent implements OnInit {
  constructor(public titleService: Title) {}

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.LoginComponent);
  }
}
