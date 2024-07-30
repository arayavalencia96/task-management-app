import { TestBed } from '@angular/core/testing';

import { ShowSectionService } from './show-section.service';

describe('ShowSectionService', () => {
  let service: ShowSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
