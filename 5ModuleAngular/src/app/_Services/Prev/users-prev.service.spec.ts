import { TestBed } from '@angular/core/testing';

import { UsersPrevService } from './users-prev.service';

describe('UsersPrevService', () => {
  let service: UsersPrevService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersPrevService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
