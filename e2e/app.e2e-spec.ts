import { ListViewTemplatePage } from './app.po';

describe('list-view-template App', function() {
  let page: ListViewTemplatePage;

  beforeEach(() => {
    page = new ListViewTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
