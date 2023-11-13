import { TestBed } from '@angular/core/testing';

import { ImageAdapterService } from './image-adapter.service';

describe('ImageAdapterService', () => {
  let service: ImageAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
