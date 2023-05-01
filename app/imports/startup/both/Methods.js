/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import {
  addDoc,
  updateDoc,
  removeDoc,
} from './DocumentFunctions';
import {
  getCollection,
  clearCollection,
  refillCollection,
  resetCollection,
  loadDefaultData,
  clearAllCollections,
} from './CollectionFunctions';

const collectionNames = [Profiles.name, Ingredients.name, Recipes.name, Vendors.name, RecipesIngredients.name, VendorsIngredients.name];

/** =============CLIENT METHODS: Modifying Single Collections==================== */
/* These first three functions are best for anything that edits documents one at a time */
/* Adds a document to the collection. example params: { collectionName: Stuffs.name, document: stuffsDoc } */
const addDocMethod = 'Doc.add';
Meteor.methods({ 'Doc.add'({ collectionName, document }) { addDoc(getCollection(collectionName), document); } });
/* Updates a document in the collection. example params: { collectionName: Stuffs.name, document: stuffsDoc } */
const updateDocMethod = 'Doc.update';
Meteor.methods({ 'Doc.update'({ collectionName, document }) { updateDoc(getCollection(collectionName), document); } });
/* Removes a document from the collection. example params: { _id: stuffsDoc._id, collectionName: Stuffs.name } */
const removeDocMethod = 'Doc.remove';
Meteor.methods({ 'Doc.remove'({ _id, collectionName }) { removeDoc(_id, getCollection(collectionName)); } });
/* Clears the collection. example params: { collectionName: Stuffs.name } */
const clearCollectionMethod = 'Collection.clear';
Meteor.methods({ 'Collection.clear'({ collectionName }) { clearCollection(getCollection(collectionName)); } });
/* Refills the collection with default data. example params: { collectionName: Stuffs.name } */
const refillCollectionMethod = 'Collection.refill';
Meteor.methods({ 'Collection.refill'({ collectionName }) { refillCollection(getCollection(collectionName)); } });
/* Clears and refills the collection with default data. example params: { collectionName: Stuffs.name } */
const resetCollectionMethod = 'Collection.reset';
Meteor.methods({ 'Collection.reset'({ collectionName }) { resetCollection(getCollection(collectionName)); } });

/** =============CLIENT METHODS: Modifying Multiple Collections================= */
/* Method to ADD a new recipe to the database (Modifies 3 collections) WORKS */
const addRecipeMethod = 'Recipes.add';
Meteor.methods({
  'Recipes.add'({ name, owner, image, instructions, time, servings, vegan, glutenFree, source, ingredients }) {
    // NOTE: ingredients is an array of RecipesIngredients documents from the Autoform
    if (Recipes.collection.find({ name }).count() !== 0) { console.log('addRecipeMethod\n  Recipe found!  Exiting.'); return; }
    addDoc(Recipes, { name, owner, image, instructions, time, servings, vegan, glutenFree, source });
    _.pluck(ingredients, 'ingredient')
      .map(ingredient => addDoc(Ingredients, { name: ingredient }));
    ingredients.map(document => addDoc(RecipesIngredients, document));
  },
});

/** Method to UPDATE a recipe in the database (Modifies 3 collections) */
const updateRecipeMethod = 'Recipes.update';
Meteor.methods({
  'Recipes.update'({ _id, name, owner, image, instructions, time, servings, vegan, glutenFree, source, ingredients }) {
    // First update the relevant Recipe document ...update({ uniqueField }, { all fields... })
    updateDoc(Recipes, { _id, name, owner, image, instructions, time, servings, vegan, glutenFree, source });
    // Remove old join docs for this recipe
    RecipesIngredients.collection.remove({ recipe: name });
    // Insert new join docs
    // At least one ingredient must exist in the array, update/insert the Ingredients collection
    _.pluck(ingredients, 'ingredient')
      .map(ingredient => addDoc(Ingredients, { name: ingredient }));
    // Finally insert the new list into the RecipesIngredients collection
    ingredients.map(ingredient => addDoc(RecipesIngredients, ingredient));
  },
});
/** Method to REMOVE a recipe from the database (Modifies 3 collections) */
const removeRecipeMethod = 'Recipes.remove';
Meteor.methods({
  'Recipes.remove'({ _id }) {
    // First retrieve the join info before removing each doc
    const recipe = Recipes.collection.findOne(_id)?.name;
    removeDoc(_id, Recipes);
    // Fetch the array of join docs and Map through and remove each
    RecipesIngredients.collection.find({ recipe }).fetch().map(document => removeDoc(document._id, RecipesIngredients));
  },
});

/** Method to RESET all collections */
const resetAllMethod = 'All.reset';
Meteor.methods({ 'All.reset'() { clearAllCollections(); loadDefaultData(); } });

// adding user to role
const addUserToRole = 'profile.addUserToRole';
Meteor.methods({
  'profile.addUserToRole'({ userId, role }) {
    console.log(`userId = ${userId}`);
    console.log(`role = ${role}`);

    Roles.createRole(role, { unlessExists: true });
    console.log('Roles.createRole worked');
    Roles.addUsersToRoles(userId, role);
    console.log('Roles.addUsersToRoles worked');
  },
});

export {
  collectionNames,
  addRecipeMethod,
  updateRecipeMethod,
  removeRecipeMethod,
  addDocMethod,
  removeDocMethod,
  updateDocMethod,
  clearCollectionMethod,
  resetCollectionMethod,
  refillCollectionMethod,
  resetAllMethod,
  addUserToRole,
};
