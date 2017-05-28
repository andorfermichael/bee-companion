import { Component } from '@angular/core';

import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import * as _ from 'lodash';

@Component({
  selector: 'admin-menu',
  styleUrls: ['./adminMenu.component.scss'],
  templateUrl: './adminMenu.component.html'
})
export class AdminMenuComponent {
  public menus: any = {
    1: false,
    2: false,
    3: false,
    4: false
  };

  constructor(public auth: Auth, public _eventsService: EventsService) {}

  public setMenuActive(menu: number): void {
    const active = !_.get(this.menus, menu);
    _.forOwn(this.menus, (val, key) => {
      _.set(this.menus, key, false);
    });
    _.set(this.menus, menu, active);
  }

  public isMenuActive(menu?: number): boolean {
    if (!menu) {
      let active = false;
      _.forOwn(this.menus, (val) => {
        if (val) {
          active = true;
        }
      });
      return active;
    } else {
      return _.get(this.menus, menu, false);
    }
  }
}
