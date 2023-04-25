import SimpleSchema from 'simpl-schema';

const RecipeFormSchema = new SimpleSchema({
  // Recipes schema
  name: { type: String, optional: false },
  owner: String,
  image: { type: String, optional: true, defaultValue: '' },
  instructions: { type: String, optional: false },
  time: { type: String, optional: false },
  servings: { type: Number, optional: false },
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
