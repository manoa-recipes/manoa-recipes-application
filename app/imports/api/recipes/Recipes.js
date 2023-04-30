import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class RecipesCollection {
  constructor() {
    // The name of this collection.
    this.name = 'RecipesCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: { type: String, index: true, unique: true },
      owner: { type: String, defaultValue: 'Default' },
      image: { type: String, optional: true },
      instructions: { type: String, optional: false },
      time: { type: String, defaultValue: '10 minutes' },
      servings: { type: Number, defaultValue: 1 },
      vegan: { type: Boolean, defaultValue: false },
      glutenFree: { type: Boolean, defaultValue: false },
      source: { type: String, defaultValue: '' },
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.vendorPublicationName = `${this.name}.publication.vendor`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const Recipes = new RecipesCollection();
