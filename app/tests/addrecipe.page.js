import { Selector } from 'testcafe';

class AddrecipePage {
  constructor() {
    this.pageId = '#add-recipe-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async hasCard(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.expect(Selector('#add-recipe-card').visible).ok();
  }

  async add_recipe(testController, name, image, time, servings, quantity, size, ingredient, instructions) {
    await testController.typeText('#name', name);
    await testController.typeText('#image', image);
    await testController.typeText('#time', time);
    await testController.typeText('#servings', servings);
    await testController.typeText('#quantity', quantity);
    await testController.typeText('#size', size);
    await testController.typeText('#ingredient', ingredient);
    await testController.typeText('#instructions', instructions);
    await testController.click('#add-recipe-sub');
    const successMessage = Selector('.swal-text').withText('Recipe added successfully');
    await testController.expect(successMessage.exists).ok();
  }
}

export const addrecipePage = new AddrecipePage();
