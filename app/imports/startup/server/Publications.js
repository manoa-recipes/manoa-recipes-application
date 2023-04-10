import { Meteor } from 'meteor/meteor';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import { Profiles } from '../../api/profiles/Profiles';

/** User level access: Everyone can see everything anyway */
// Publish all ingredient documents.
Meteor.publish(Ingredients.userPublicationName, () => Ingredients.collection.find());

// Publish all profile documents.
Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());

// Publish all Recipe Documents.
Meteor.publish(Recipes.userPublicationName, () => Recipes.collection.find());

// Publish all RecipesIngredients Documents.
Meteor.publish(RecipesIngredients.userPublicationName, () => RecipesIngredients.collection.find());

// Publish all Vendor Documents.
Meteor.publish(Vendors.userPublicationName, () => Vendors.collection.find());

// Publish all Vendor-AdminDataIngredient relations.
Meteor.publish(VendorsIngredients.userPublicationName, () => VendorsIngredients.collection.find());

// Vendor-level publication.

/** Admin level publications */

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
