import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';

/* eslint-disable no-console */

/** For Debugging */
const verbose = true;
/* App is being actively developed. */
const inDevelopment = true;
/* Whether the settings file has the expected data */
const defaultDataExists = (Meteor.settings.defaultProfiles && Meteor.settings.defaultRecipes && Meteor.settings.defaultVendors && Meteor.settings.defaultRecipesIngredients && Meteor.settings.defaultVendorsIngredients) !== undefined;
/* True when there are no Meteor users */
const onFirstRun = Meteor.users.find().count() === 0;
/* Flag to reinitialize the data */
const ingredientsAreEmpty = Ingredients.collection.find({}).count() === 0;
if (verbose) { console.log('Mongo.js running...\n  verbose:', verbose, '\n  default data exists: ', defaultDataExists, '\n  First run: ', onFirstRun, '\n  ingredients empty: ', ingredientsAreEmpty); }

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

  // adding user role
  if (role === 'user') { promoteUser(userID, role); }
}

// Add document to the Ingredients collection
const addIngredient = (ingredient) => {
  console.log(`addIngredient(${ingredient})`);
  if (verbose) { console.log(`... Ingredients.collection.update({ name: ${ingredient} }, { $set: { name: ... } }, { upsert: true })`); }
  Ingredients.collection.update({ name: ingredient }, { $set: { name: ingredient } }, { upsert: true });
};

// Add document to the Profiles collection
const addProfile = ({ email, role, vegan, glutenFree, allergies }) => {
  console.log(`addProfile(${email}, ${role}, ...)`);
  // Probably a better way to frame this expression
  if (Meteor.users.find({ username: email }).count() === 0) {
    // Only create a user if there is no existing user for the email
    createUser(email, role);
  } else { console.log('... User already exists for', email); }
  if (verbose) {
    console.log(`... Profiles.collection.insert(\n... { email: ...,\n...   vegan: ${vegan},\n...   glutenFree: ${glutenFree}`);
    if (allergies.length > 0) {
      console.log('...   allergies: [');
      allergies.map((allergy, index) => console.log(`...     ${index}: ${allergy}`));
      console.log('...   ]\n... })');
    } else {
      console.log('...   allergies: []\n... })');
    }
  }
  if (allergies) {
    Profiles.collection.insert({ email, vegan, glutenFree, allergies });
  } else {
    Profiles.collection.insert({ email, vegan, glutenFree });
  }
};

// Add document to the RecipesIngredients collection
const addRecipeIngredient = ({ recipe, ingredient, size, quantity }) => {
  console.log(`addRecipeIngredient({ ${recipe}, ${ingredient}, ...})`);
  addIngredient(ingredient);
  if (verbose) { console.log(`... RecipesIngredients.collection.insert(\n... {\n...   recipe: ...,\n...   ingredient: ...,\n...   size: ${size},\n...   quantity: ${quantity},\n... })`); }
  RecipesIngredients.collection.insert({ recipe: recipe, ingredient: ingredient, size: size, quantity: quantity });
};

// Add document to the Recipes collection
const addRecipe = ({ name, owner, image, instructions, time, servings }) => {
  console.log(`addRecipe(${name}, ${owner}, ...)`);
  if (verbose) { console.log(`... RecipesIngredients.collection.insert(\n... {\n...   name: ...,\n...   owner: ...,\n...    image: ${image},\n...    instructions: ${instructions},\n...   time: ${time},\n...   servings: ${servings},\n... })`); }
  Recipes.collection.insert({ name: name, owner: owner, image: image, instructions: instructions, time: time, servings: servings });
};

// Add document to the Vendors collection
const addVendor = ({ name, address, hours, image, email }) => {
  console.log(`addVendor(${name}, ${address}, ${hours}, ${image}), ${email}`);
  if (verbose) { console.log('... Vendors.collection.insert({ name: ..., address: ..., hours: ..., image: ... })'); }
  Vendors.collection.insert({ name, address, hours, image, email });
};

// Add document to the VendorsIngredients collection
const addVendorIngredient = ({ email, address, ingredient, inStock, size, price }) => {
  console.log(`addVendorIngredient(${email}, ${address}, ${ingredient}, ...)`);
  addIngredient(ingredient);
  if (verbose) { console.log(`... VendorsIngredients.collection.insert(\n... {\n...   address: ...,\n...   ingredient: ...,\n...   inStock: ${inStock},\n...   size: ${size},\n...   price: ${price}\n... })`); }
  VendorsIngredients.collection.insert({ email, address, ingredient, inStock, size, price });
};

// Function to reset a collection
const resetCollectionServer = (collection) => {
  console.log(`\nResetting ${collection.name}...\n  Count Pre-Clear: ${collection.collection.find({}).count()}`);
  collection.collection.remove({});
  console.log(`  Count Post-Clear: ${collection.collection.find({}).count()}`);
  switch (collection.name) {
  case Profiles.name: Meteor.settings.defaultProfiles.map(data => addProfile(data)); break;
  case Recipes.name: Meteor.settings.defaultRecipes.map(data => addRecipe(data)); break;
  case RecipesIngredients.name: Meteor.settings.defaultRecipesIngredients.map(data => addRecipeIngredient(data)); break;
  case Vendors.name: Meteor.settings.defaultVendors.map(data => addVendor(data)); break;
  case VendorsIngredients.name: Meteor.settings.defaultVendorsIngredients.map(data => addVendorIngredient(data)); break;
  default: console.log(`  ${collection.name} not recognized!`);
  }
  console.log(`  Count Post-Add: ${collection.collection.find({}).count()}`);
};

// Warn through the console if ingredients are empty (many of the app's functionality is based on it)
if (ingredientsAreEmpty && !inDevelopment) { console.log('Warning! Ingredients collection is empty!'); }
/** Expression to populate the collections with default data. */
if (onFirstRun || (ingredientsAreEmpty && inDevelopment)) {
  if (onFirstRun) { console.log('Initializing database.'); } else { console.log('Reinitializing database.'); }
  if (defaultDataExists) {
    if (onFirstRun) {
      console.log('\nCreating default profiles.');
      Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
      console.log('\nCreating default recipes.');
      Meteor.settings.defaultRecipes.map(recipe => addRecipe(recipe));
      console.log('\nCreating default recipesingredients.');
      Meteor.settings.defaultRecipesIngredients.map(recipeIngredient => addRecipeIngredient(recipeIngredient));
      console.log('\nCreating default vendors.');
      Meteor.settings.defaultVendors.map(vendor => addVendor(vendor));
      console.log('\nCreating default vendorsingredients.');
      Meteor.settings.defaultVendorsIngredients.map(vendorIngredient => addVendorIngredient(vendorIngredient));
      console.log('\nCollections initialized with default data from "settings.development.json".');
    } else {
      resetCollectionServer(Profiles);
      resetCollectionServer(Recipes);
      resetCollectionServer(RecipesIngredients);
      resetCollectionServer(Vendors);
      resetCollectionServer(VendorsIngredients);
    }
  } else {
    console.log('Error: Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
