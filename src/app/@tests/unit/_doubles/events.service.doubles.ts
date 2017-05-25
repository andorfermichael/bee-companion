import { EventsService } from '../../../@services/events.service';

export class MockBroadcastComponent {
  constructor(public _eventsService: EventsService) {}

  public sendBroadcast(success: boolean) {
    if (success) {
      this._eventsService.broadcast('mockBroadcastSuccess');
    } else {
      this._eventsService.broadcast('mockBroadcastFail', 'failed', {error: success});
    }
  }
}

export class MockListenerComponent {
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

