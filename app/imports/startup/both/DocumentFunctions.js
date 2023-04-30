/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';

const isJoin = (collection) => ((collection.name === RecipesIngredients.name) || (collection.name === VendorsIngredients.name));

// Add user to their Meteor role.
function promoteUser(userID, role) {
  Roles.createRole(role, { unlessExists: true });
  Roles.addUsersToRoles(userID, role);
}

// Add user to the Meteor accounts.
function createUser(email, role) {
  // If the username isn't taken...
  if (Meteor.users.find({ username: email }).count() === 0) {
    // Create the user
    const userID = Accounts.createUser({ username: email, email, password: 'changeme' });
    // Promote the user if their role is not blank and is defined
    if (role !== '' && role !== undefined) { promoteUser(userID, role); }
  } else { console.log('... User already exists for', email); }
}

// Add document to the Ingredients collection
const addIngredient = (ingredient) => Ingredients.collection.update({ name: ingredient }, { $set: { name: ingredient } }, { upsert: true });

// Add document to the Profiles collection
const addProfile = ({ email, role, vegan, glutenFree, allergies }) => {
  // Probably a better way to frame this expression
  createUser(email, role);
  if (allergies) {
    Profiles.collection.insert({ email, vegan, glutenFree, allergies });
  } else {
    Profiles.collection.insert({ email, vegan, glutenFree, allergies: [] });
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
    if (isJoin(collection)) {
      // If it is the join collection, update the Ingredients document first
      const name = document.ingredient;
      Ingredients.collection.update({ name }, { $set: { name } }, { upsert: true });
    }
    if (collection.name === Profiles.name) {
      // If it is the Profiles collection, reuse the function
      addProfile(document);
    }
    collection.collection.update(document, { $set: document }, { upsert: true });
  } else { console.log(`  Collection "${collection}" not recognized!`); }
};
/** _Server Func_ example params: (Stuffs, stuffsDoc) */
const updateDoc = (collection, document) => {
  if (collection !== undefined) {
    collection.collection.update({ _id: document?._id }, { $set: document });
  } else { console.log(`Collection "${collection}" not recognized!`); }
};
/** _Server Func_ example params: (stuffsDoc._id, Stuffs) */
const removeDoc = (_id, collection) => { if (collection !== undefined) { collection.collection.remove(_id); } else { console.log(`Collection "${collection}" not recognized!`); } };

export {
  createUser,
  promoteUser,
  addProfile,
  addRecipeIngredient,
  addRecipe,
  addVendorIngredient,
  addVendor,
  addDoc,
  updateDoc,
  removeDoc,
};
