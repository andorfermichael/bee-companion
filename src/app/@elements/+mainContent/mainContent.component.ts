import { Component, OnInit } from '@angular/core';
import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'mainContent',
  styleUrls: [ './mainContent.component.scss' ],
  templateUrl: './mainContent.component.html'
})
export class MainContentComponent implements OnInit {

    public headerIsToggled: boolean = false;

    constructor(public auth: Auth, public _eventsService: EventsService,
                private localStorage: LocalStorageService) {}

    public ngOnInit() {
        this.headerIsToggled = this.localStorage.retrieve('headerIsToggled');
        this._eventsService.on('headerToggled', (toggle) => {
            this.headerIsToggled = toggle;
        });
    }
}
