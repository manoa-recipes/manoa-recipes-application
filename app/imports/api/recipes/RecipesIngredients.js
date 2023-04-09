import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class RecipesIngredientsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'RecipesIngredientsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      recipe: String,
      ingredient: String,
      size: { type: String, defaultValue: 'whole' },
      quantity: { type: Number, defaultValue: 1 },
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.vendorPublicationName = `${this.name}.publication.vendor`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const RecipesIngredients = new RecipesIngredientsCollection();
