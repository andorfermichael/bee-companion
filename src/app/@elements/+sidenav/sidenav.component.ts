import { Component, OnInit, ElementRef, HostListener, ViewChild, Input } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Auth } from '../../@services/auth.service';
import { EventsService } from '../../@services/events.service';

@Component({
  selector: 'side-nav',
  styleUrls: ['./sidenav.component.scss'],
  templateUrl: './sidenav.component.html'
})
export class SideNavComponent {
  public static getOffsetLeft(element) {
    return (element.offsetWidth / 2) + element.offsetLeft +
      (element.offsetParent ? element.offsetParent.offsetLeft : 0);
  }

  constructor(private elemRef: ElementRef, private sanitizer: DomSanitizer,
              public auth: Auth, private router: Router, public _eventsService: EventsService) {
  }
}
