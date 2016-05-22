import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { PageLoadingData } from './PageLoadingData';

describe('Myservice Service', () => {
  beforeEachProviders(() => [PageLoadingData]);

  it('should ...',
    inject([PageLoadingData], (service: PageLoadingData) => {
      expect(service).toBeTruthy();
    }));
});
