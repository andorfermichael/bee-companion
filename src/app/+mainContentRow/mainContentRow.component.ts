import {
  Component,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'mainContentRow',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './mainContentRow.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './mainContentRow.component.html',
})
export class MainContentRowComponent implements OnInit {

  public ngOnInit() {}

}
