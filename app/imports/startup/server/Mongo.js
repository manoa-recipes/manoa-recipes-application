import { Meteor } from 'meteor/meteor';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import { addProfile, addRecipe, addVendor, addRecipeIngredient, addVendorIngredient, resetCollection } from '../both/Methods';

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
      resetCollection(Profiles);
      resetCollection(Recipes);
      resetCollection(RecipesIngredients);
      resetCollection(Vendors);
      resetCollection(VendorsIngredients);
    }
  } else {
    console.log('Error: Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
