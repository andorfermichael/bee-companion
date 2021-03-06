import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class EventsService {
  private listeners: any;
  private eventsSubject: any;
  private events: any;

  constructor() {
    this.listeners = {};
    this.eventsSubject = new Rx.Subject();

    this.events = Rx.Observable.from(this.eventsSubject);

    this.events.subscribe(
      ({name, args}) => {
        if (this.listeners[name]) {
          for (const listener of this.listeners[name]) {
            listener(...args);
          }
        }
      });
  }

  public on(name, listener): void {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(listener);
  }

  public off(name): void {
    if (this.listeners[name]) {
      this.listeners[name] = [];
    }
  }

  public broadcast(name, ...args): void {
    this.eventsSubject.next({
      name,
      args
    });
  }
}
