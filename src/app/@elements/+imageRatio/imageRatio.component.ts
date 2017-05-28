import { OnInit, OnDestroy, OnChanges, Component, Input } from '@angular/core';

import { Auth } from '../../@services/auth.service';

@Component({
  selector: 'imageRatio',
  styleUrls: [ './imageRatio.component.scss' ],
  templateUrl: './imageRatio.component.html'
})
export class ImageRatioComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public url: string;
    @Input() public width: string;
    @Input() public height: string;
    public imgSrc: string;

    constructor(public auth: Auth) {}

    public ngOnInit() {
      if (!this.url) {
        console.error('Image Url needs to be passed to imageRatio Component!');
        return;
      }
      this.imgSrc = `url('${this.url}')`;
    }

    public ngOnChanges() {
      if (!this.url) {
        console.error('Image Url needs to be passed to imageRatio Component!');
        return;
      }
      this.imgSrc = `url('${this.url}')`;
    }

    public ngOnDestroy() {
      this.imgSrc = null;
    }
}
