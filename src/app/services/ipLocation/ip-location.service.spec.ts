import { TestBed } from '@angular/core/testing';

import { IpLocationService } from './ip-location.service';

describe('IpLocationService', () => {
  let service: IpLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
