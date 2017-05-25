import { TestBed, inject } from '@angular/core/testing';

import { EventsService } from '../../../@services/events.service';

import { MockBroadcastComponent, MockListenerComponent } from '../_doubles/events.service.doubles'

describe('EventsService', () => {
  let service: EventsService;
  let broadcastComponent: MockBroadcastComponent;
  let listenerComponent: MockListenerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventsService
      ]
    });
  });

  beforeEach(inject([EventsService], (eventsService: EventsService) => {
    service = eventsService;
    broadcastComponent = new MockBroadcastComponent(service);
    listenerComponent = new MockListenerComponent(service);
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
