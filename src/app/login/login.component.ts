import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'loginPage',
  styleUrls: [ './login.component.scss' ],
  templateUrl: './login.component.html'
})

export class LoginPageComponent implements OnInit {

  constructor() {}

  loginActive: boolean
  
  public ngOnInit() {}

  public ngAfterViewInit() {}
}
