import { Selector } from 'testcafe';

class VendorsPage {
  constructor() {
    this.pageId = '#vendor-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async hasCard(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.expect(Selector('#vendor-card').visible).ok();
  }
}

export const vendorspage = new VendorsPage();
