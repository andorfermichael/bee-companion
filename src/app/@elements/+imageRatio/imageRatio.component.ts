import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, Component, Input } from '@angular/core';

import { Auth } from '../../@services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { HttpModule } from '@angular/http';

import * as _ from 'lodash';

@Component({
  selector: 'imageRatio',
  styleUrls: [ './imageRatio.component.scss' ],
  templateUrl: './imageRatio.component.html'
})

export class ImageRatioComponent implements OnInit {

    @Input() public url: string;
    @Input() public width: string;
    @Input() public height: string;

    constructor(  public auth: Auth, private activatedRoute: ActivatedRoute,
                  public authHttp: AuthHttp ) {}

    public ngOnInit() {
      if (!this.url) {
        console.error('Image Url needs to be passed to imageRatio Component!');
        return;
      }
      this.url = `url('${this.url}')`;
    }
}
