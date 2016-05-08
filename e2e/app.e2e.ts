import { EmsPage } from './app.po';

describe('ems App', function() {
  let page: EmsPage;

  beforeEach(() => {
    page = new EmsPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ems works!');
  });
});
