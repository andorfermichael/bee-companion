import {
  Component,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'mainCard',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './mainCard.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './mainCard.component.html',
})
export class MainCardComponent implements OnInit {

  public ngOnInit() {}

}
