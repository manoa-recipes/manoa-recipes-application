import { Selector } from 'testcafe';

class ListrecipePage {
  constructor() {
    this.pageId = '#list-recipe-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async hasCard(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.expect(Selector('#featured-recipe').visible).ok();
    await testController.expect(Selector('#list-recipe-card').visible).ok();
    await testController.expect(Selector('#list-recipe-card').count).gte(2);
  }
}

export const listrecipePage = new ListrecipePage();
