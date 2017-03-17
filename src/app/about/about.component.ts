import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { NavComponent } from '../+nav';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'aboutUs'
  selector: 'aboutUs',  // <aboutUs></aboutUs>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  // providers: [
  //  Title
  // ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './about.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './about.component.html'
})
export class AboutUsComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    //public title: Title
  ) {}

  public ngOnInit() {
    console.log('hello `AboutUs` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
