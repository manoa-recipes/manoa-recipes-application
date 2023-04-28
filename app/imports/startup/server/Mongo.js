import { Meteor } from 'meteor/meteor';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import {
  addProfile,
  addRecipe,
  addVendor,
  addRecipeIngredient,
  addVendorIngredient,
  getDefaultData,
  addDoc,
} from '../both/Methods';

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
// Warn through the console if ingredients are empty (many of the app's functionality is based on it)
if (ingredientsAreEmpty && !inDevelopment) { console.log('Warning! Ingredients collection is empty!'); }

const collections = [Profiles, Vendors, RecipesIngredients, VendorsIngredients];

/** Expression to populate the collections with default data. */
if (onFirstRun || (ingredientsAreEmpty && inDevelopment)) {
  if (onFirstRun) { console.log('Initializing database.'); } else { console.log('Reinitializing database.'); }
  if (defaultDataExists) {
    if (onFirstRun) {
      console.log('\nCreating default Profiles, Vendors, and join collections.');
      collections.map(collection => getDefaultData(collection.name).map(document => addDoc(collection, document)));
      console.log('\nCreating default Recipes.');
      Meteor.settings.defaultRecipes.map(recipe => addRecipe(recipe));
      console.log('\nCollections initialized with default data from "settings.development.json".');
    } else {
      // collections.map(collection => getDefaultData)
    }
  } else {
    console.log('Error: Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
