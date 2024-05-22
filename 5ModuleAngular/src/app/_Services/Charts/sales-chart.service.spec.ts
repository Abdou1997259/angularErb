import { TestBed } from '@angular/core/testing';

import { SalesChartService } from './sales-chart.service';

describe('SalesChartService', () => {
  let service: SalesChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
