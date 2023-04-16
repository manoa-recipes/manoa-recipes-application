import { Meteor } from 'meteor/meteor';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';

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

/** Method to add a NEW recipe to the database (Modifies 3 collections) */
const addRecipeMethod = 'Recipes.add';

Meteor.methods({
  'Recipes.add'({ name, owner, image, instructions, time, servings, ingredients }) {
    // First add to the Recipes collection
    Recipes.collection.insert({ name, owner, image, instructions, time, servings });
    // At least one ingredient must exist in the array, update/insert the Ingredients collection
    ingredients.map(ingredient => Ingredients.collection.update({ name: ingredient.ingredient }, { $set: { name: ingredient.ingredient } }, { upsert: true }));
    // Finally insert into the RecipesIngredients collection
    ingredients.map((ingredient) => RecipesIngredients.collection.insert({ recipe: name, ingredient: ingredient.ingredient, size: ingredient.size, quantity: ingredient.quantity }));
  },
});

/** From: AddRecipe page.
 *  Note: this needs to be consistent to avoid unforeseeable errors ~4/15/2023 */
// // Recipes schema
// name: { type: String, index: true, unique: true },
// // owner: String, is retrieved from the user, not the form
// image: { type: String, optional: true, defaultValue: '' },
// instructions: { type: String, optional: false },
// time: { type: Number, optional: false },
// servings: { type: Number, optional: false },
// ingredients: { // 'ingredients' array elements are actually RecipesIngredients documents
//    type: Array,
//    minCount: 1, // Every recipe needs at least one VALID document
//  },
// // RecipesIngredients schema
// 'ingredients.$': Object,
// 'ingredients.$.ingredient': String,
// 'ingredients.$.size': { type: String, defaultValue: 'whole' },
// 'ingredients.$.quantity': { type: Number, defaultValue: 1 },

const updateRecipeMethod = 'Recipes.update';

Meteor.methods({
  'Recipes.update'({ name, owner, image, instructions, time, servings, ingredients }) {
    // First update the relevant Recipe document ...update({ uniqueField }, { all fields... })
    Recipes.collection.update({ name }, { name, owner, image, instructions, time, servings });
    // Remove all previous relational documents for this recipe before repopulating them from the new list
    RecipesIngredients.collection.remove({ recipe: name });
    // At least one ingredient must exist in the array, update/insert the Ingredients collection
    ingredients.map(ingredient => Ingredients.collection.update({ name: ingredient.ingredient }, { $set: { name: ingredient.ingredient } }, { upsert: true }));
    // Finally insert the new list into the RecipesIngredients collection
    ingredients.map((ingredient) => RecipesIngredients.collection.insert({ recipe: name, ingredient: ingredient.ingredient, size: ingredient.size, quantity: ingredient.quantity }));
  },
});

export { addRecipeMethod, updateRecipeMethod };
