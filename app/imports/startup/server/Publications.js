import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesAllergies } from '../../api/profiles/ProfilesAllergies';

/** User level access */

/** Publish all Ingredients Documents. Everyone has full access */
Meteor.publish(Ingredients.userPublicationName, () => Ingredients.collection.find());

/** Publish Profile Document for logged in user */
Meteor.publish(Profiles.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Profiles.collection.find({ owner: username });
  }
  return this.ready();
});

/** Publish Profile-Allergies relations for logged in user */
Meteor.publish(ProfilesAllergies.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return ProfilesAllergies.collection.find({ owner: username });
  }
  return this.ready();
});

/** Publish all Recipes Documents. */
Meteor.publish(Recipes.userPublicationName, () => Recipes.collection.find());

/** Publish all Recipes-Ingredients Relations. */
Meteor.publish(RecipesIngredients.userPublicationName, () => Recipes.collection.find());

/** Publish all Vendors Documents. */
Meteor.publish(Vendors.userPublicationName, () => Vendors.collection.find());

/** Publish all Vendors-Ingredients relations. */
Meteor.publish(VendorsIngredients.userPublicationName, () => VendorsIngredients.collection.find());

// Vendor-level publication.

/** Admin level publications: edit access and view */
/** Publish all Recipes for Admins.
 *  Publish owned Recipes for users (hopefully) */
Meteor.publish(Recipes.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Recipes.collection.find();
  }
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Recipes.collection.find({ owner: username });
  }
  return this.ready();
});
Meteor.publish(Stuffs.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.collection.find();
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
