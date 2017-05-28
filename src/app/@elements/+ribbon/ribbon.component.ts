import { Component, Input } from '@angular/core';

@Component({
  selector: 'ribbon',
  styleUrls: [ './ribbon.component.scss' ],
  templateUrl: './ribbon.component.html'
})

export class RibbonComponent {
    @Input() public type: string;
}
