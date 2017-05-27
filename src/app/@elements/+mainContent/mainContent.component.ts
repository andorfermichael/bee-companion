import { Component, OnInit, Input } from '@angular/core';
import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'mainContent',
  styleUrls: [ './mainContent.component.scss' ],
  templateUrl: './mainContent.component.html'
})
export class MainContentComponent implements OnInit {
  public headerIsToggled: boolean = false;
  public location: string = '';
  public userIsAdmin: boolean = false;
  public userRole: string;
  @Input() public hideSideNav: boolean;

  constructor(public auth: Auth, public _eventsService: EventsService,
              private localStorage: LocalStorageService, private router: Router) {}

  public ngOnInit() {
    this.headerIsToggled = this.localStorage.retrieve('headerIsToggled');
    this._eventsService.on('headerToggled', (toggle) => {
      this.headerIsToggled = toggle;
    });

    this.userRole = this.auth.checkUserHasRole();
    if (this.userRole === 'Admin' || this.userRole === 'admin') {
      this.userIsAdmin = true;
    }

    this.location = this.router.url;
  }
}
