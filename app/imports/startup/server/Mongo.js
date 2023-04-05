import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';

/* eslint-disable no-console */

/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser(email, role) {
  const userID = Accounts.createUser({ username: email, email, password: 'changeme' });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
  if (role === 'vendor') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
}

const addIngredient = (ingredient) => {
  console.log(`  Adding/Updating Ingredient: ${ingredient}`);
  Ingredients.collection.update({ name: ingredient }, { $set: { name: ingredient } }, { upsert: true });
};
const addRecipeIngredient = ({ recipe, ingredient, quantity }) => {
  console.log(`  Adding/Updating RecipeIngredient: ${ingredient} (${recipe})`);
  RecipesIngredients.collection.update({ name: ingredient }, { $set: { name: ingredient } }, { upsert: true });
};
const addRecipe = ({ name, owner, image, description, instructions, time, servings, ingredients }) => {
  console.log(`  Adding/Updating Recipe: ${name} (${owner})`);
  Recipes.collection.insert({ name: name, owner: owner, image: image, description: description, instructions: instructions, time: time, servings: servings });
};

if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultProjects && Meteor.settings.defaultProfiles) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.forEach(({ email, password, role }) => createUser(email, password, role));
    console.log('Creating the default profiles');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
    console.log('Creating the default projects');
    Meteor.settings.defaultProjects.map(project => addProject(project));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}

/** Initialize Databases */
// Ingredients

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.collection.insert(data);
};

// Initialize the StuffsCollection if empty.
if (Stuffs.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}
