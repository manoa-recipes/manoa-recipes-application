import { Selector } from 'testcafe';

class VendorprofilePage {
  constructor() {
    this.pageId = '#vendor-profile-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async hasCard(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.expect(Selector('#my-profile').visible).ok();
    await testController.expect(Selector('#vendor-information-card').visible).ok();
  }
}

export const vendorprofilePage = new VendorprofilePage();
