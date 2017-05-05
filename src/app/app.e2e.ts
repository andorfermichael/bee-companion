import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have header', () => {
    const subject = element(by.css('h1')).isPresent();
    const result  = true;
    expect(subject).toEqual(result);
  });
});
