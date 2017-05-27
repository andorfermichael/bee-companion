import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { Auth } from './@services/auth.service';
import { PageTitlePrefix, PageTitles, MetaTags } from './@config/meta.config';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ Auth ],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './app.component.scss' ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public logo = 'assets/img/BeeCompanion_smallLogo.png';
  public name = 'BeeCompanion';
  public url = 'https://www.bee-companion.com/';

  constructor(private titleService: Title , private metaService: Meta, private auth: Auth) {
    this.auth.handleAuth();
  }

  public ngOnInit() {
    this.titleService.setTitle(PageTitlePrefix + PageTitles.AppComponent);
    this.metaService.addTag({property: 'description', content: MetaTags.AppComponent.Description});
    this.metaService.addTag({property: 'keywords', content: MetaTags.AppComponent.Keywords});
    this.metaService.addTag({property: 'robots', content: MetaTags.AppComponent.Robots});
    this.metaService.addTag({property: 'og:url', content: MetaTags.AppComponent.OG.Url});
    this.metaService.addTag({property: 'og:site_name', content: MetaTags.AppComponent.OG.SiteName});
    this.metaService.addTag(
      {
        property: 'article:publisher',
        content: MetaTags.AppComponent.OG.SiteName
      }
    );

    for (const tag of MetaTags.AppComponent.OG.ArticleTags) {
      this.metaService.addTag({property: 'article:tag', content: tag});
    }

    this.metaService.addTag({property: 'og:image', content: MetaTags.AppComponent.OG.Image});
  }
}
