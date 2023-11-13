import { TestBed } from '@angular/core/testing';

import { RecordAdapterService } from './record-adapter.service';

describe('RecordAdapterService', () => {
  let service: RecordAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
