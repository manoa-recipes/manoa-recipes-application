import { Selector } from 'testcafe';

class UserhomePage {
  constructor() {
    this.pageId = '#userhome-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async hasCard(testController) {
    await testController.expect(Selector('.g-4').child('.col').count).gte(1);
  }
}

export const userhomepage = new UserhomePage();
