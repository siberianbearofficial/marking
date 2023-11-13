import { TestBed } from '@angular/core/testing';

import { RecordApiService } from './record-api.service';

describe('RecordApiService', () => {
  let service: RecordApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
