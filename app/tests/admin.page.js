import { Selector } from 'testcafe';

class AdminPage {
  constructor() {
    this.pageId = '#admin-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async admin_ingredients(testController) {
    await testController.click(Selector('button').withText('Server Data'));
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

/*  async admin_profiles_data(testController) {
    await testController.click('#admin-profiles');
    await testController.expect(Selector('table').withText('id').exists).ok();
    await testController.expect(Selector('table').withText('email (*)').exists).ok();
    await testController.expect(Selector('table').withText('vegan').exists).ok();
    await testController.expect(Selector('table').withText('glutenFree').exists).ok();
    await testController.expect(Selector('table tbody tr').count).gte(5);
  }

  async admin_vendors_collection(testController) {
    await testController.click('#admin-vendors-collection');
    await testController.expect(Selector('table').withText('id').exists).ok();
    await testController.expect(Selector('table').withText('name').exists).ok();
    await testController.expect(Selector('table').withText('address (*)').exists).ok();
    await testController.expect(Selector('table tbody tr').count).gte(2);
  }

  async admin_recipes_collection(testController) {
    await testController.click('#recipes-collection');
    await testController.expect(Selector('table').withText('id').exists).ok();
    await testController.expect(Selector('table').withText('name (*)').exists).ok();
    await testController.expect(Selector('table').withText('owner').exists).ok();
    await testController.expect(Selector('table').withText('instructions').exists).ok();
    await testController.expect(Selector('table').withText('time').exists).ok();
    await testController.expect(Selector('table').withText('servings').exists).ok();
    await testController.expect(Selector('table tbody tr').count).gte(2);
  }

  async admin_recipesIngredients_collection(testController) {
    await testController.click(Selector('button').withText('Join Collections'));
    await testController.click('#recipesIngredients-collection');
    await testController.expect(Selector('table').withText('id').exists).ok();
    await testController.expect(Selector('table').withText('Recipe').exists).ok();
    await testController.expect(Selector('table').withText('Ingredient').exists).ok();
    await testController.expect(Selector('table').withText('Size').exists).ok();
    await testController.expect(Selector('table').withText('Quantity').exists).ok();
    await testController.expect(Selector('table tbody tr').count).gte(5);
  }

  async admin_vendorsIngredients_collection(testController) {
    await testController.click('#admin-vendorsIngredients-collection');
    await testController.expect(Selector('table').withText('id').exists).ok();
    await testController.expect(Selector('table').withText('address').exists).ok();
    await testController.expect(Selector('table').withText('ingredient').exists).ok();
    await testController.expect(Selector('table').withText('inStock').exists).ok();
    await testController.expect(Selector('table').withText('size').exists).ok();
    await testController.expect(Selector('table').withText('price').exists).ok();
    await testController.expect(Selector('table tbody tr').count).gte(5);
  } */
}

export const adminPage = new AdminPage();
