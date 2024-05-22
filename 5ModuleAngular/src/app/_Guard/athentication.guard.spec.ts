import { TestBed } from '@angular/core/testing';

import { AthenticationGuard } from './athentication.guard';

describe('AthenticationGuard', () => {
  let guard: AthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
