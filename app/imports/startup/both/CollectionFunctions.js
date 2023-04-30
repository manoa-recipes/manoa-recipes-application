/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import {
  addDoc,
} from './DocumentFunctions';

/** All of the collections */
const collections = [Ingredients, RecipesIngredients, VendorsIngredients, Profiles, Recipes, Vendors];

/** _Server Func_ */
/* Params: (_Stuffs_.name)
 * Returns: The _Collection_ matched from the name */
const getCollection = (collectionName) => {
  switch (collectionName) {
  case Recipes.name: return Recipes;
  case Profiles.name: return Profiles;
  case Ingredients.name: return Ingredients;
  case RecipesIngredients.name: return RecipesIngredients;
  case Vendors.name: return Vendors;
  case VendorsIngredients.name: return VendorsIngredients;
  default: console.log('Collection not supported: ', collectionName); return undefined;
  }
};
/** _Server Func_ */
/* Params: (Stuffs.name)
 * Returns: an array of default data documents based on collection name */
const getDefaultData = (collectionName) => {
  // Returns the default data based on collection name
  switch (collectionName) {
  case Ingredients.name:
    // Pluck the ingredient field from the join documents
    return _.pluck(Meteor.settings.defaultVendorsIngredients
      .concat(Meteor.settings.defaultRecipesIngredients), 'ingredient')
    // and map them into name fields of new objects to match insertion to collection
      .map(name => ({ name }));
  case Recipes.name:
    return Meteor.settings.defaultRecipes;
  case Profiles.name:
    return Meteor.settings.defaultProfiles;
  case RecipesIngredients.name:
    return Meteor.settings.defaultRecipesIngredients;
  case Vendors.name:
    return Meteor.settings.defaultVendors;
  case VendorsIngredients.name:
    return Meteor.settings.defaultVendorsIngredients;
  default:
    console.log('Collection not supported: ', collectionName);
    return undefined;
  }
};

/** _Server Func_ example param: (Stuffs) */
const clearCollection = (collection) => collection.collection.remove({});
/** _Server Func_ example param: (Stuffs) */
const refillCollection = (collection) => getDefaultData(collection.name).map(document => addDoc(collection, document));
/** _Server Func_ example param: (Stuffs) */
const resetCollection = (collection) => { clearCollection(collection); refillCollection(collection); };
const clearAllCollections = () => collections.map(collection => clearCollection(collection));

const loadDefaultData = () => {
  const defaultDataExists = (Meteor.settings.defaultProfiles && Meteor.settings.defaultRecipes && Meteor.settings.defaultVendors && Meteor.settings.defaultRecipesIngredients && Meteor.settings.defaultVendorsIngredients) !== undefined;
  if (defaultDataExists) {
    console.log('\nLoading additional data from:\n  app/public/settings.development.json');
    collections.map(collection => refillCollection(collection));
    console.log('Collections initialized.');
  } else { console.log('\nWarning!\n  Please start Meteor with a settings file at:\n  app/public/settings.development.json\n'); }
  if (Meteor.settings.loadAssetsFile) {
    const assetsFileName = 'data.json';
    console.log(`Loading additional data from:\n  app/private/${assetsFileName}`);
    const jsonData = JSON.parse(Assets.getText(assetsFileName));
    jsonData.profiles?.map(document => addDoc(Profiles, document));
    jsonData.recipes?.map(document => addDoc(Recipes, document));
    jsonData.recipesIngredients?.map(document => addDoc(RecipesIngredients, document));
    jsonData.vendors?.map(document => addDoc(Vendors, document));
    jsonData.vendorsIngredients?.map(document => addDoc(VendorsIngredients, document));
    jsonData.ingredients?.map(document => addDoc(Ingredients, document));
    console.log('Additional data added.\n');
  }
};

export {
  collections,
  getCollection,
  getDefaultData,
  clearCollection,
  refillCollection,
  resetCollection,
  loadDefaultData,
  clearAllCollections,
};
