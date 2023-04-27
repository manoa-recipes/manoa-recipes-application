import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';

/** === I'm leaving all this here for reference ===
 *
 * In Bowfolios, insecure mode is enabled, so it is possible to update the server's Mongo database by making
 * changes to the client MiniMongo DB.
 *
 * However, updating the database via client-side calls can be inconvenient for two reasons:
 *   1. If we want to update multiple collections, we need to use nested callbacks in order to trap errors, leading to
 *      the dreaded "callback hell".
 *   2. For update and removal, we can only provide a docID as the selector on the client-side, making bulk deletes
 *      hard to do via nested callbacks.
 *
 * A simple solution to this is to use Meteor Methods (https://guide.meteor.com/methods.html). By defining and
 * calling a Meteor Method, we can specify code to be run on the server-side but invoked by clients. We don't need
 * to use callbacks, because any errors are thrown and sent back to the client. Also, the restrictions on the selectors
 * are removed for server-side code.
 *
 * Meteor Methods are commonly introduced as the necessary approach to updating the DB once the insecure package is
 * removed, and that is definitely true, but Bowfolios illustrates that they can simplify your code significantly
 * even when prototyping. It turns out that we can remove insecure mode if we want, as we use Meteor methods to update
 * the database.
 *
 * Note that it would be even better if each method was wrapped in a transaction so that the database would be rolled
 * back if any of the intermediate updates failed. Left as an exercise to the reader.
 */

/** === I'm leaving all this here for reference === */
// const updateProfileMethod = 'Profiles.update';
//
// // The server-side Profiles.update Meteor Method is called by the client-side Home page after pushing the update button.
// // Its purpose is to update the Profiles, ProfilesInterests, and ProfilesProjects collections to reflect the
// // updated situation specified by the user.
// Meteor.methods({
//   'Profiles.update'({ email, firstName, lastName, bio, title, picture, interests, projects }) {
//     Profiles.collection.update({ email }, { $set: { email, firstName, lastName, bio, title, picture } });
//     ProfilesInterests.collection.remove({ profile: email });
//     ProfilesProjects.collection.remove({ profile: email });
//     interests.map((interest) => ProfilesInterests.collection.insert({ profile: email, interest }));
//     projects.map((project) => ProfilesProjects.collection.insert({ profile: email, project }));
//   },
// });
//
// const addProjectMethod = 'Projects.add';
//
// Meteor.methods({
//   'Projects.add'({ name, description, picture, interests, participants, homepage }) {
//     Projects.collection.insert({ name, description, picture, homepage });
//     ProfilesProjects.collection.remove({ project: name });
//     ProjectsInterests.collection.remove({ project: name });
//     if (interests) {
//       interests.map((interest) => ProjectsInterests.collection.insert({ project: name, interest }));
//     } else {
//       throw new Meteor.Error('At least one interest is required.');
//     }
//     if (participants) {
//       participants.map((participant) => ProfilesProjects.collection.insert({ project: name, profile: participant }));
//     }
//   },
// });

// Add user to their Meteor role.
function promoteUser(userID, role) {
  Roles.createRole(role, { unlessExists: true });
  Roles.addUsersToRoles(userID, role);
}

// Add user to the Meteor accounts.
function createUser(email, role) {
  const userID = Accounts.createUser({ username: email, email, password: 'changeme' });
  if (role === 'admin') { promoteUser(userID, role); }
  if (role === 'vendor') { promoteUser(userID, role); }
  // adding user role
  if (role === 'user') { promoteUser(userID, role); }
}

// Add document to the Ingredients collection
const addIngredient = (ingredient) => Ingredients.collection.update({ name: ingredient }, { $set: { name: ingredient } }, { upsert: true });

// Add document to the Profiles collection
const addProfile = ({ email, role, vegan, glutenFree, allergies }) => {
  // Probably a better way to frame this expression
  if (Meteor.users.find({ username: email }).count() === 0) {
    // Only create a user if there is no existing user for the email
    createUser(email, role);
  } else { console.log('... User already exists for', email); }
  if (allergies) {
    Profiles.collection.insert({ email, vegan, glutenFree, allergies });
  } else {
    Profiles.collection.insert({ email, vegan, glutenFree });
  }
};

// Add document to the RecipesIngredients collection
const addRecipeIngredient = ({ recipe, ingredient, size, quantity }) => {
  addIngredient(ingredient);
  RecipesIngredients.collection.insert({ recipe: recipe, ingredient: ingredient, size: size, quantity: quantity });
};

// Add document to the Recipes collection
const addRecipe = ({ name, owner, image, instructions, time, servings }) => Recipes.collection.insert({ name: name, owner: owner, image: image, instructions: instructions, time: time, servings: servings });

// Add document to the Vendors collection
const addVendor = ({ name, address, hours, image, email }) => Vendors.collection.insert({ name, address, hours, image, email });

// Add document to the VendorsIngredients collection
const addVendorIngredient = ({ email, address, ingredient, inStock, size, price }) => {
  addIngredient(ingredient);
  VendorsIngredients.collection.insert({ email, address, ingredient, inStock, size, price });
};
/** _Server Func_ example params: (Stuffs, stuffsDoc) */
const addDoc = (collection, document) => {
  if (collection !== undefined) {
    // Collection.collection.insert({ ...fields: keys... });...
    // Collection.collection.update({ ...ifNew... }, { ...ifExists... }, { ...options... });...
    collection.collection.update(document, { $set: document }, { upsert: true });
  } else { console.log(`  Collection "${collection}" not recognized!`); }
};
/** _Server Func_ example params: (Stuffs, stuffsDoc) */
const updateDoc = (collection, document) => {
  console.log('updateDoc:\n  _id: ', document._id, '\n  Collection: ', collection.name);
  // Dont try to access a field of an undefined object (ERRORS)
  if (collection !== undefined) {
    collection.collection.update({ _id: document._id }, { $set: document });
  } else { console.log(`Collection "${collection}" not recognized!`); }
};
/** _Server Func_ example params: (stuffsDoc._id, Stuffs) */
const removeDoc = (_id, collection) => { if (collection !== undefined) { collection.collection.remove(_id); } else { console.log(`Collection "${collection}" not recognized!`); } };
/** _Server Func_ example param: (Stuffs.name) */
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
/** _Server Func_ example param: (Stuffs.name) */
const getDefaultData = (collectionName) => {
  switch (collectionName) {
  case Recipes.name: return Meteor.settings.defaultRecipes;
  case Profiles.name: return Meteor.settings.defaultProfiles;
  case RecipesIngredients.name: return Meteor.settings.defaultRecipesIngredients;
  case Vendors.name: return Meteor.settings.defaultVendors;
  case VendorsIngredients.name: return Meteor.settings.defaultVendorsIngredients;
  default: console.log('Collection not supported: ', collectionName); return undefined;
  }
};
/** _Server Func_ example param: (Stuffs.name) */
const resetCollection = (collectionName) => {
  const collection = getCollection(collectionName);
  const defaultData = getDefaultData(collectionName);
  if (collection && defaultData) {
    // Remove documents if there are any
    if (collection.collection.find({}).count() > 0) { collection.collection.remove({}); }
    // Refill the collection with its default data
    defaultData.map((document, index) => {
      if (collectionName === RecipesIngredients.name) { addDoc(Ingredients, { name: document.ingredient }); }
      if (collectionName === VendorsIngredients.name) { addDoc(Ingredients, { name: document.ingredient }); }
      addDoc(collection, document);
      return index + 1;
    });
  } else { console.log(`Reset failed. collection: ${collection}, defaultData: ${defaultData} Exiting...`); }
};

/** =============CLIENT METHODS: Modifying Single Collections==================== */
/* These first three functions are best for anything that edits documents one at a time */
/* example params: { collectionName: Stuffs.name, document: stuffsDoc } */
const addDocMethod = 'Doc.add';
Meteor.methods({ 'Doc.add'({ collectionName, document }) { addDoc(getCollection(collectionName), document); } });
/* example params: { collectionName: Stuffs.name, document: stuffsDoc } */
const updateDocMethod = 'Doc.update';
Meteor.methods({ 'Doc.update'({ collectionName, document }) { updateDoc(getCollection(collectionName), document); } });
/* example params: { _id: stuffsDoc._id, collectionName: Stuffs.name } */
const removeDocMethod = 'Doc.remove';
Meteor.methods({ 'Doc.remove'({ _id, collectionName }) { removeDoc(_id, getCollection(collectionName)); } });

/** =============CLIENT METHODS: Modifying Multiple Collections================= */
/* Method to ADD a new recipe to the database (Modifies 3 collections) WORKS */
const addRecipeMethod = 'Recipes.add';
Meteor.methods({
  'Recipes.add'({ name, owner, image, instructions, time, servings, ingredients }) {
    // NOTE: ingredients is an array of RecipesIngredients documents from the Autoform
    if (Recipes.collection.find({ name }).count() !== 0) { console.log('addRecipeMethod\n  Recipe found!  Exiting.'); return; }
    addDoc(Recipes, { name, owner, image, instructions, time, servings });
    _.pluck(ingredients, 'ingredient').map(ingredient => addDoc(Ingredients, { name: ingredient }));
    ingredients.map(document => addDoc(RecipesIngredients, document));
  },
});

/** Method to UPDATE a recipe in the database (Modifies 3 collections) */
const updateRecipeMethod = 'Recipes.update';
Meteor.methods({
  'Recipes.update'({ _id, name, owner, image, instructions, time, servings, vegan, glutenFree, ingredients }) {
    // First update the relevant Recipe document ...update({ uniqueField }, { all fields... })
    Recipes.collection.update(_id, { $set: { name, owner, image, instructions, time, servings, vegan, glutenFree } });
    // Remove all previous relational documents for this recipe before repopulating them from the new list
    RecipesIngredients.collection.remove({ recipe: name });
    // At least one ingredient must exist in the array, update/insert the Ingredients collection
    ingredients.map(ingredient => Ingredients.collection.update({ name: ingredient.ingredient }, { $set: { name: ingredient.ingredient } }, { upsert: true }));
    // Finally insert the new list into the RecipesIngredients collection
    ingredients.map((ingredient) => RecipesIngredients.collection.insert({ recipe: name, ingredient: ingredient.ingredient, size: ingredient.size, quantity: ingredient.quantity }));
  },
});
/** Method to REMOVE a recipe from the database (Modifies 3 collections) */
const removeRecipeMethod = 'Recipes.remove';
Meteor.methods({
  'Recipes.remove'({ _id }) {
    // First retrieve the join info before removing each doc
    const name = Recipes.collection.findOne(_id).name;
    Recipes.collection.remove(_id);
    const ingredients = _.pluck(RecipesIngredients.collection.find({ recipe: name }).fetch(), 'ingredient');
    RecipesIngredients.collection.remove({ recipe: name });
    ingredients.map(ingredient => Ingredients.collection.remove({ name: ingredient }));
  },
});

export { createUser, promoteUser, addProfile, addRecipeIngredient, addRecipe, addVendorIngredient, addVendor, resetCollection,
  addRecipeMethod, updateRecipeMethod, removeRecipeMethod, addDocMethod, removeDocMethod, updateDocMethod,
};
