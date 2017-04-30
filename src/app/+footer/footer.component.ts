import {
  Component,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'footer',
   // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './footer.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {

  public ngOnInit() {}

}
