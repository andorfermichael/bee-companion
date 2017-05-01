import {
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'privacyPolicy',
  styleUrls: [ './privacy.component.scss' ],
  templateUrl: './privacy.component.html'
})

export class PrivacyPolicyComponent implements OnInit {

  public localState: any;

  constructor(public route: ActivatedRoute) {}

  public ngOnInit() {
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });
    this.asyncDataWithWebpack();
  }

  private asyncDataWithWebpack() {
    setTimeout(() => {
      System.import('../../assets/mock-data/mock-data.json')
        .then((json) => {
          console.log('async mockData', json);
          this.localState = json;
        });
    });
  }
}
