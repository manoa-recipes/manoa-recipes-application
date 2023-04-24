import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class VendorsIngredientsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'VendorsIngredientsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      email: String,
      address: String,
      ingredient: String,
      inStock: { type: Boolean, defaultValue: true },
      size: { type: String, defaultValue: 'whole' },
      price: { type: Number, defaultValue: 0.01 },
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.vendorPublicationName = `${this.name}.publication.vendor`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const VendorsIngredients = new VendorsIngredientsCollection();
