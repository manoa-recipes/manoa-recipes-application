import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useParams } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../../components/LoadingSpinner';
import RecipeCard from '../../components/recipe/RecipeCard';
import { Recipes } from '../../../api/recipes/Recipes';
import { RecipesIngredients } from '../../../api/recipes/RecipesIngredients';
import { Ingredients } from '../../../api/ingredients/Ingredients';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListRecipeByIngredient = () => {
  // ID of the ingredient
  const { _id } = useParams();
  const { ready, ingredient, names } = useTracker(() => {
    const sub1 = Meteor.subscribe(Recipes.userPublicationName);
    const sub2 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const sub3 = Meteor.subscribe(Ingredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    const ingredientName = Ingredients.collection.findOne(_id)?.name;
    // Return only the recipes to render
    return {
      ingredient: ingredientName,
      names: _.pluck(RecipesIngredients.collection.find({ ingredient: ingredientName }).fetch(), 'recipe'),
      ready: rdy,
    };
  }, [_id]);
  // Map through all the recipe names matched through cross checking the ingredient and RecipesIngredients and return documents that are matched
  const recipes = ready ? _.flatten(names.map(name => Recipes.collection.find({ name }).fetch())) : undefined;
  return (ready && recipes !== undefined ? (
    <Container className="py-3" id="list-recipe-page">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>View Recipes by Ingredient: {ingredient}</h2>
          </Col>
          <Row xs={1} md={2} lg={3} className="g-4">
            {(recipes?.length > 0) ? recipes.map((recipe) => (<Col key={recipe._id}><RecipeCard recipe={recipe} /></Col>)) : (<div>No results</div>)}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListRecipeByIngredient;
