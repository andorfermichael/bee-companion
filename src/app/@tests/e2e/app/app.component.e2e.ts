import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  xit('should have header', async () => {
    const subject = await element(by.css('h1')).isPresent();
    const result  = true;
    expect(subject).toEqual(result);
  });
});
