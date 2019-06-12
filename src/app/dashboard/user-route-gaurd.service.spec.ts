import { TestBed } from '@angular/core/testing';

import { UserRouteGaurdService } from './user-route-gaurd.service';

describe('UserRouteGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRouteGaurdService = TestBed.get(UserRouteGaurdService);
    expect(service).toBeTruthy();
  });
});
