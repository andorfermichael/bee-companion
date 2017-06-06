import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Directive } from '@angular/core';

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  private subjectQuery = new BehaviorSubject(this.testQueryParams);
  queryParams = this.subjectQuery.asObservable();

  // Test parameters
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // Test query parameters
  private _testQueryParams: {};
  get testQueryParams() { return this._testQueryParams; }
  set testQueryParams(queryParams: {}) {
    this._testQueryParams = queryParams;
    this.subjectQuery.next(queryParams);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams, queryParams: this.testQueryParams };
  }
}

export let MockRouter = {
  navigate: jasmine.createSpy('navigate')
};

@Directive({
  selector: '[routerLink], [routerLinkActive], [routerLinkActiveOptions]'
})
export class DummyRouterLinkDirective {}
