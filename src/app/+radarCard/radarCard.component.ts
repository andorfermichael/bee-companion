import {
  Component,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'radarCard',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './radarCard.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './radarCard.component.html',
})
export class RadarCardComponent implements OnInit {

  public ngOnInit() {}

}
