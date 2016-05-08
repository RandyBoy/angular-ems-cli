import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { EmsAppComponent } from '../app/ems.component';

beforeEachProviders(() => [EmsAppComponent]);

describe('App: Ems', () => {
  it('should create the app',
      inject([EmsAppComponent], (app: EmsAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'ems works!\'',
      inject([EmsAppComponent], (app: EmsAppComponent) => {
    expect(app.title).toEqual('ems works!');
  }));
});
