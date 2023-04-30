import SimpleSchema from 'simpl-schema';

const RecipeFormSchema = new SimpleSchema({
  // Recipes schema
  name: { type: String, index: true, unique: true },
  owner: { type: String, defaultValue: 'Default' },
  image: { type: String, optional: true },
  instructions: { type: String, optional: false },
  time: { type: String, optional: false },
  servings: { type: Number, optional: false },
  vegan: { type: Boolean, defaultValue: false },
  glutenFree: { type: Boolean, defaultValue: false },
  source: { type: String, defaultValue: '' },
  ingredients: {
    type: Array,
    minCount: 1,
  },
  // RecipesIngredients schema
  'ingredients.$': Object,
  'ingredients.$.recipe': String,
  'ingredients.$.ingredient': String,
  'ingredients.$.size': { type: String, defaultValue: 'whole' },
  'ingredients.$.quantity': { type: Number, defaultValue: 1 },
}, { clean: true });

export { RecipeFormSchema };
