import { TestBed } from '@angular/core/testing';

import { AuthenticationAdapterService } from './authentication-adapter.service';

describe('AuthenticationAdapterService', () => {
  let service: AuthenticationAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
