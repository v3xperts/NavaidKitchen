import { KitchenFrontSrcPage } from './app.po';

describe('kitchen-front-src App', () => {
  let page: KitchenFrontSrcPage;

  beforeEach(() => {
    page = new KitchenFrontSrcPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
