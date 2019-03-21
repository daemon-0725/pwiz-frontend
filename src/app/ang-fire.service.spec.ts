import { TestBed, inject } from '@angular/core/testing';

import { AngFireService } from './ang-fire.service';

describe('AngFireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngFireService]
    });
  });

  it('should be created', inject([AngFireService], (service: AngFireService) => {
    expect(service).toBeTruthy();
  }));
});
