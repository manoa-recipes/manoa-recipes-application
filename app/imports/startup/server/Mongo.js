import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { IngredientsAllergies } from '../../api/ingredients/IngredientsAllergies';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';

/* eslint-disable no-console */

const verbose = false;

// Add user to their Meteor role.
function promoteUser(userID, role) {
  if (verbose) { console.log(`... promoteUser(${userID}, ${role})`); }
  Roles.createRole(role, { unlessExists: true });
  Roles.addUsersToRoles(userID, role);
}

// Add user to the Meteor accounts.
function createUser(email, role) {
  console.log(`  createUser(${email}, ${role})`);
  const userID = Accounts.createUser({ username: email, email, password: 'changeme' });
  if (role === 'admin') { promoteUser(userID, role); }
  if (role === 'vendor') { promoteUser(userID, role); }
}

// Add document to the Ingredients collection
const addIngredient = (ingredient) => {
  console.log(`addIngredient(${ingredient})`);
  if (verbose) { console.log(`... Ingredients.collection.update({ name: ${ingredient} }, { $set: { name: ... } }, { upsert: true })`); }
  Ingredients.collection.update({ name: ingredient }, { $set: { name: ingredient } }, { upsert: true });
};

// Add document to the IngredientsAllergies collection
const addIngredientAllergy = ({ profile, ingredient }) => {
  console.log(`addIngredientAllergy({ ${profile}, ${ingredient} })`);
  if (verbose) { console.log('... IngredientsAllergies.collection.insert({ profile: ..., ingredient: ... })'); }
  IngredientsAllergies.collection.insert({ profile: profile, ingredient: ingredient });
};

// Add document to the Profiles collection
const addProfile = ({ email, role, vegan, glutenFree }) => {
  console.log(`addProfile(${email}, ${role}, ...)`);
  createUser(email, role);
  if (verbose) { console.log(`... Profiles.collection.insert(\n... { email: ...,\n...   vegan: ${vegan},\n...   glutenFree: ${glutenFree}\n... })`); }
  Profiles.collection.insert({ email, vegan, glutenFree });
};

// Add document to the RecipesIngredients collection
const addRecipeIngredient = ({ recipe, ingredient, size, quantity }) => {
  console.log(`addRecipeIngredient({ ${recipe}, ${ingredient}, ...})`);
  addIngredient(ingredient);
  if (verbose) { console.log(`... RecipesIngredients.collection.insert(\n... {\n...   recipe: ...,\n...   ingredient: ...,\n...   size: ${size},\n...   quantity: ${quantity},\n... })`); }
  RecipesIngredients.collection.insert({ recipe: recipe, ingredient: ingredient, size: size, quantity: quantity });
};

// Add document to the Recipes collection
const addRecipe = ({ name, owner, instructions, time, servings }) => {
  console.log(`addRecipe(${name}, ${owner}, ...)`);
  if (verbose) { console.log(`... RecipesIngredients.collection.insert(\n... {\n...   name: ...,\n...   owner: ...,\n...   instructions: ${instructions},\n...   time: ${time},\n...   servings: ${servings},\n... })`); }
  Recipes.collection.insert({ name: name, owner: owner, instructions: instructions, time: time, servings: servings });
};

// Add document to the Vendors collection
const addVendor = ({ name, address }) => {
  console.log(`addVendor(${name}, ${address})`);
  if (verbose) { console.log('... Vendors.collection.insert({ name: ..., address: ... })'); }
  Vendors.collection.insert({ name, address });
};

// Add document to the VendorsIngredients collection
const addVendorIngredient = ({ address, ingredient, inStock, size, price }) => {
  console.log(`addVendorIngredient(${address}, ${ingredient}, ...)`);
  addIngredient(ingredient);
  if (verbose) { console.log(`... VendorsIngredients.collection.insert(\n... {\n...   address: ...,\n...   ingredient: ...,\n...   inStock: ${inStock},\n...   size: ${size},\n...   price: ${price}\n... })`); }
  VendorsIngredients.collection.insert({ address, ingredient, inStock, size, price });
};

/** Function to populate the collections with default data when installed for the first time. */
if (Meteor.users.find().count() === 0) {
  console.log('No users found.  Initializing database.');
  if (Meteor.settings.defaultProfiles && Meteor.settings.defaultRecipes && Meteor.settings.defaultVendors) {
    console.log('Creating default profiles.');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
    console.log('Creating default recipes.');
    Meteor.settings.defaultRecipes.map(recipe => addRecipe(recipe));
    console.log('Creating default recipesingredients.');
    Meteor.settings.defaultRecipesIngredients.map(recipeIngredient => addRecipeIngredient(recipeIngredient));
    console.log('Creating default ingredientsallergies.');
    Meteor.settings.defaultIngredientsAllergies.map(ingredientAllergy => addIngredientAllergy(ingredientAllergy));
    console.log('Creating default vendors.');
    Meteor.settings.defaultVendors.map(vendor => addVendor(vendor));
    console.log('Creating default vendorsingredients.');
    Meteor.settings.defaultVendorsIngredients.map(vendorIngredient => addVendorIngredient(vendorIngredient));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
