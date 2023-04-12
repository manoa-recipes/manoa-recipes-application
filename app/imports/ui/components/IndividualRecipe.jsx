import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { Card, Container, Image } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import IndRecIngredientList from './IndRecIngredientList';

// This page/component displays ALL data related to a specific recipe
const IndividualRecipe = ({ recipe }) => {
  // Deconstruct the passed object and extract the name field
  const { name, owner, image, instructions, time, servings } = recipe;
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipeIngredients, vendorIngredients } = useTracker(() => {
    // Access all collections (Even price information for ingredients)
    const subRecipes = Meteor.subscribe(Recipes.collection.userPublicationName);
    const subRecipeIngredients = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const subIngredients = Meteor.subscribe(Ingredients.userPublicationName);
    const subVendors = Meteor.subscribe(Vendors.userPublicationName);
    const subVendorIngredients = Meteor.subscribe(VendorsIngredients.userPublicationName);

    // Determine if the subscriptions are ready
    const rdy = subRecipes.ready() && subRecipeIngredients.ready() && subIngredients.ready() && subVendors.ready() && subVendorIngredients.ready();

    // Get the list of ingredients (for the selected/passed recipe)
    const ingredientItems = _.pluck(RecipesIngredients.collection.find({ recipe: name }).fetch(), 'ingredient');
    // Get the actual data for the ingredient that is specific to the recipe
    const recipeIngredientItems = RecipesIngredients.collection.find({ recipe: name }).fetch();
    // Get the vendor data for each ingredient (might have multiple locations for each ingredient)
    const vendorIngredientItems = ingredientItems.map(ingredientItem => VendorsIngredients.collection.find({ ingredientItem }).fetch());
    return {
      recipeIngredients: recipeIngredientItems,
      vendorIngredients: vendorIngredientItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Card>
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Image src={image} fluid />
          <Card.Subtitle>Submitted by: {owner}, Time: {time} minutes, Serves: {servings}</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Text>{instructions}</Card.Text>
          <IndRecIngredientList recipeIngredients={recipeIngredients} vendorIngredients={vendorIngredients} />
        </Card.Body>
      </Card>
    </Container>
  ) : <LoadingSpinner />);
};
IndividualRecipe.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    image: PropTypes.string,
    instructions: PropTypes.string,
    time: PropTypes.number,
    servings: PropTypes.number,
  }).isRequired,
};

export default IndividualRecipe;
