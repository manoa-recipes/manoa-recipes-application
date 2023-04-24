import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { signupPage } from './signup.page';
import { userhomepage } from './userhome.page';
import { vendorspage } from './vendors.page';
import { profilepage } from './profile.page';
import { listrecipePage } from './listrecipe.page';
// import { addrecipePage } from './addrecipe.page';
import { adminPage } from './admin.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const credentials_admin = { username: 'admin@foo.com', password: 'changeme' };
// const testaddrecipe = { name: 'test', image: 'testcafe.image', time: '30', servings: '1', quantity: '2', size: 'half', ingredient: 'Tomato', instructions: 'for test cafe' };
fixture('meteor-application-template-react localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that signup works', async (testController) => {
  await navBar.gotoSignUpPage(testController);
  // Sign up a new user
  const username = `testuser-${Date.now()}@example.com`;
  const password = 'testpassword';
  await signupPage.signupUser(testController, username, password);
  await navBar.isLoggedIn(testController, username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that userhome page shows up and the card is displayed', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoUserHomePage(testController);
  await userhomepage.isDisplayed(testController);
  await userhomepage.hasCard(testController);
});

test.only('Test that Vendor page shows up and the card is displayed', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoVendorsPage(testController);
  await vendorspage.isDisplayed(testController);
  await vendorspage.hasCard(testController);
});

test('Test that profile page shows up. Test "My-profile" and "user information" is displayed.', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoProfilePage(testController);
  await profilepage.isDisplayed(testController);
  await profilepage.hasCard(testController);
});

test('Test that list recipe page shows up and the card is visible', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoListRecipePage(testController);
  await listrecipePage.isDisplayed(testController);
  await listrecipePage.hasCard(testController);
});

test('Test that admin page shows up and works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials_admin.username, credentials_admin.password);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.admin_ingredients(testController);
  await adminPage.admin_profiles(testController);
  await adminPage.admin_vendors_collection(testController);
  await adminPage.admin_recipes_collection(testController);
  await adminPage.admin_recipesIngredients_collection(testController);
  await adminPage.admin_vendorsIngredients_collection(testController);
});

// test('Test that add recipe page shows up and works', async (testController) => {
//   await navBar.gotoSignInPage(testController);
//   await signinPage.signin(testController, credentials.username, credentials.password);
//   await navBar.gotoAddRecipePage(testController);
//   await addrecipePage.isDisplayed(testController);
//   await addrecipePage.hasCard(testController);
//   await addrecipePage.add_recipe(testController, testaddrecipe.name, testaddrecipe.image, testaddrecipe.time, testaddrecipe.servings, testaddrecipe.quantity, testaddrecipe.size, testaddrecipe.ingredient, testaddrecipe.instructions);
// });
