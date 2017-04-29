import {
  Component,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'mainContent',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './mainContent.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './mainContent.component.html'
})
export class MainContentComponent implements OnInit {

  public ngOnInit() {}

}
