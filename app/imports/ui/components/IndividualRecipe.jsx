import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Card, Container, Image } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import RecipeIngredientList from './RecipeIngredientList';

// This page/component displays ALL data related to a specific recipe
const IndividualRecipe = ({ recipe }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipeIngredients } = useTracker(() => {
    const subRecipeIngredients = Meteor.subscribe(RecipesIngredients.userPublicationName);

    // Determine if the subscriptions are ready
    const rdy = subRecipeIngredients.ready();

    // Get the list of ingredients (for the selected/passed recipe)
    const ingredientItems = RecipesIngredients.collection.find({ recipe: recipe.name }).fetch();
    return {
      recipeIngredients: ingredientItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Card>
        <Card.Header>
          <Card.Title>{recipe.name}</Card.Title>
          <Image src={recipe.image} />
          <Card.Subtitle>Submitted by: {recipe.owner}, Time: {recipe.time} minutes, Serves: {recipe.servings}</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Text>{recipe.instructions}</Card.Text>
          <RecipeIngredientList recipeIngredients={recipeIngredients} />
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
