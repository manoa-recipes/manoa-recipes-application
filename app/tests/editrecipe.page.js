import { Selector } from 'testcafe';

class EditrecipePage {
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
    await testController.expect(Selector('.g-4').child('.col').count).gte(2);
    const first_card = Selector('.g-4 .col').nth(1);
    await testController.click(first_card);
    await testController.click(Selector('#edit'));
    await testController.wait(10000).expect(Selector('#edit-recipe-page').visible).ok();
  }
}

export const editrecipePage = new EditrecipePage();
