import { TestBed } from '@angular/core/testing';

import { ErstellenDetailService } from './erstellen-detail.service';

describe('ErstellenDetailService', () => {
  let service: ErstellenDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErstellenDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
