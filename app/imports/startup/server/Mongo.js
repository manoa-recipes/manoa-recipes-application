import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { ProfilesAllergies } from '../../api/profiles/ProfilesAllergies';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';

/* eslint-disable no-console */

const debug = true;

// Simple function to add a user to the Meteor roles.
function promoteUser(userID, role) {
  if (debug) { console.log(`  promoteUser called: ${userID} (${role})`); }

  Roles.createRole(role, { unlessExists: true });
  Roles.addUsersToRoles(userID, 'admin');
}

// Function to add a user to the Meteor accounts.
function createUser(email, role) {
  if (debug) { console.log(`  createUser called: ${email} (${role})`); }

  const userID = Accounts.createUser({ username: email, email, password: 'changeme' });
  if (role === 'admin') { promoteUser(userID, role); }
  if (role === 'vendor') { promoteUser(userID, role); }
}

// Function to add to or update the Ingredients data collection.
const addIngredient = (ingredient) => {
  if (debug) { console.log(`  addIngredient called for ${ingredient}.`); }

  /** Each document has a unique "name" field. */
  Ingredients.collection.update({ name: ingredient }, { $set: { name: ingredient } }, { upsert: true });
};

// Function to add to or update the RecipesIngredients relational collection.
const addRecipeIngredient = ({ recipe, ingredient, quantity }) => {
  if (debug) { console.log(`  addRecipeIngredient called for ${recipe}: ${ingredient} (${quantity})`); }

  // Add to or update the Ingredients collection before the relational collection
  addIngredient(ingredient);

  /** Each document relates the quantity for each ingredient for their corresponding recipes. */
  RecipesIngredients.collection.update({ recipe: recipe, ingredient: ingredient }, { $set: { recipe: recipe, ingredient: ingredient, quantity: quantity } }, { upsert: true });
};

// Function to add to the Recipes data collection.
const addRecipe = ({ name, owner, image, description, instructions, time, servings, ingredients }) => {
  if (debug) { console.log(`  addRecipe called for ${name}: (${owner})`); }

  /** Each document has a unique "name" field. */
  Recipes.collection.insert({ name: name, owner: owner, image: image, description: description, instructions: instructions, time: time, servings: servings });

  // Add to or update the relational documents associated with this recipe
  ingredients.map(ingredient => addRecipeIngredient(ingredient));
};

// Function to add to the Profiles data collection.
const addProfile = ({ email, role, firstName, lastName, bio, picture, vegan, glutenFree, ingredients }) => {
  if (debug) { console.log(`  addProfile called for ${email}: (${role})`); }

  /** Each document has a unique "email" */
  Profiles.collection.insert({ firstName, lastName, bio, picture, vegan, glutenFree });

  // Add to or update the documents that relate profiles with allergies
  ingredients.map(ingredient => ProfilesAllergies.collection.insert({ email, ingredient }));
};

// Function to add new vendors to the Vendors data collection.
const addVendor = ({ name, address }) => {
  if (debug) { console.log(`  addVendor called for ${name}: (${address})`); }
  Vendors.collection.insert({ name, address });
};

/** Function to populate the collections with default data when installed for the first time. */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultProjects && Meteor.settings.defaultProfiles) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.forEach(({ email, password, role }) => createUser(email, password, role));
    console.log('Creating the default profiles');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
    console.log('Creating the default recipes');
    Meteor.settings.defaultRecipes.map(recipe => addRecipe(recipe));
    console.log('Creating the default vendors');
    Meteor.settings.defaultVendors.map(vendor => addVendor(vendor));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
