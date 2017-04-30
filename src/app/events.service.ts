import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class EventsService {
    constructor() {
        this.listeners = {};
        this.eventsSubject = new Rx.Subject();

        this.events = Rx.Observable.from(this.eventsSubject);

        this.events.subscribe(
            ({name, args}) => {
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
    }

    private listeners:any
    private eventsSubject: any
    private events: any

    on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    broadcast(name, ...args) {
        this.eventsSubject.next({
            name,
            args
        });
    }
}

// Example usage:
// Broadcast:
// function handleHttpError(error) {
//     this.eventsService.broadcast('http-error', error);
//     return ( Rx.Observable.throw(error) );
// }

// Listener:
// import {Inject, Injectable} from "angular2/core";
// import {EventsService}      from './events.service';

// @Injectable()
// export class HttpErrorHandler {
//     constructor(eventsService) {
//         this.eventsService = eventsService;
//     }

//     static get parameters() {
//         return [new Inject(EventsService)];
//     }

//     init() {
//         this.eventsService.on('http-error', function(error) {
//             console.group("HttpErrorHandler");
//             console.log(error.status, "status code detected.");
//             console.dir(error);
//             console.groupEnd();
//         });
//     }
// }