import { TestBed } from '@angular/core/testing';

import { FormsOperationGuard } from './forms-operation.guard';

describe('FormsOperationGuard', () => {
  let guard: FormsOperationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FormsOperationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
