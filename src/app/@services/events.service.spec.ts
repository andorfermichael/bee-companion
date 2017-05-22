import { TestBed, inject } from '@angular/core/testing';

import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let broadcastComponent: mockBroadcastComponent;
  let listenerComponent: mockListenerComponent;

  class mockBroadcastComponent {
    constructor(public _eventsService: EventsService) {}

    public sendBroadcast(success: boolean) {
      if (success) {
        this._eventsService.broadcast('mockBroadcastSuccess');
      } else {
        this._eventsService.broadcast('mockBroadcastFail', 'failed', {error: success});
      }
    }
  }

  class mockListenerComponent {
    constructor(public _eventsService: EventsService) {
    }

    public ngOnInit() {
      this._eventsService.on('mockBroadcastFail', (err) => {
        console.error(err)
      });
      this._eventsService.on('mockBroadcastSuccess', () => {
        console.log('Success')
      });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventsService
      ]
    });
  });

  beforeEach(inject([EventsService], (eventsService: EventsService) => {
    service = eventsService;
    broadcastComponent = new mockBroadcastComponent(service);
    listenerComponent = new mockListenerComponent(service);
  }));

  it('EventsService should send success broadcast message from component to another component', () => {
    spyOn(service, 'broadcast');
    broadcastComponent.sendBroadcast(true);
    expect(service.broadcast).toHaveBeenCalledWith('mockBroadcastSuccess');

    spyOn(service, 'on');
    listenerComponent.ngOnInit();
    expect(service.on).toHaveBeenCalled();
  });

  it('EventsService should send error broadcast message from component to another component', () => {
    spyOn(service, 'broadcast');
    broadcastComponent.sendBroadcast(false);
    expect(service.broadcast).toHaveBeenCalledWith('mockBroadcastFail', 'failed', { error: false });

    spyOn(service, 'on');
    listenerComponent.ngOnInit();
    expect(service.on).toHaveBeenCalled();
  });
});
