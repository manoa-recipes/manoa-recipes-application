import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { signupPage } from './signup.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };

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

test.only('Test that signup works', async (testController) => {
  // Go to the signup page
  await navBar.gotoSignUpPage(testController);

  // Sign up a new user
  const username = 'testuser@example12.com';
  const password = 'testpassword';
  await signupPage.signupUser(testController, username, password);

  await navBar.isLoggedIn(testController, username);

  // Log out the user
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});
