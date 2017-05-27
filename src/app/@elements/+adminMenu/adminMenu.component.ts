import { Component, OnInit, ElementRef, HostListener, ViewChild, Input } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';
import * as _ from 'lodash';

@Component({
  selector: 'admin-menu',
  styleUrls: ['./adminMenu.component.scss'],
  templateUrl: './adminMenu.component.html'
})
export class AdminMenuComponent {
  public static getOffsetLeft(element) {
    return (element.offsetWidth / 2) + element.offsetLeft +
      (element.offsetParent ? element.offsetParent.offsetLeft : 0);
  }

  public menus = {
    1: false,
    2: false,
    3: false,
    4: false
  };

  constructor(private elemRef: ElementRef, private sanitizer: DomSanitizer,
              public auth: Auth, private router: Router, public _eventsService: EventsService) {
  }

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
      _.forOwn(this.menus, (val, key) => {
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
