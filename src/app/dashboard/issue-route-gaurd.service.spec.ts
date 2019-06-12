import { TestBed } from '@angular/core/testing';

import { IssueRouteGaurdService } from './issue-route-gaurd.service';

describe('IssueRouteGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueRouteGaurdService = TestBed.get(IssueRouteGaurdService);
    expect(service).toBeTruthy();
  });
});
