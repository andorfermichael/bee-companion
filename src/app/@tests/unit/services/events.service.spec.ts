import { TestBed } from '@angular/core/testing';

import { EventsService } from '../../../@services/events.service';

import { MockBroadcastComponent, MockListenerComponent } from '../_doubles/events.service.doubles'

describe('EventsService', () => {
  let eventsService: EventsService;
  let broadcastComponent: MockBroadcastComponent;
  let listenerComponent: MockListenerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventsService
      ]
    });
  });

  beforeEach(() => {
    eventsService = TestBed.get(EventsService);
    broadcastComponent = new MockBroadcastComponent(eventsService);
    listenerComponent = new MockListenerComponent(eventsService);
  });

  it('EventsService should send success broadcast message from component to another component', () => {
    spyOn(eventsService, 'broadcast');
    broadcastComponent.sendBroadcast(true);
    expect(eventsService.broadcast).toHaveBeenCalledWith('mockBroadcastSuccess');

    spyOn(eventsService, 'on');
    listenerComponent.ngOnInit();
    expect(eventsService.on).toHaveBeenCalled();
  });

  it('EventsService should send error broadcast message from component to another component', () => {
    spyOn(eventsService, 'broadcast');
    broadcastComponent.sendBroadcast(false);
    expect(eventsService.broadcast).toHaveBeenCalledWith('mockBroadcastFail', 'failed', { error: false });

    spyOn(eventsService, 'on');
    listenerComponent.ngOnInit();
    expect(eventsService.on).toHaveBeenCalled();
  });
});
