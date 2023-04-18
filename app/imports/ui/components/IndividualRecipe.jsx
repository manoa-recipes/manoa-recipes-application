import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Card, CardGroup, Row, Col, Container, Image } from 'react-bootstrap';
import { useParams } from 'react-router';
import LoadingSpinner from './LoadingSpinner';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import RecipeIngredient from './RecipeIngredient';
import { Recipes } from '../../api/recipes/Recipes';

const verbose = true;

// This page/component displays ALL data related to a specific recipe
const IndividualRecipe = () => {
  const { _id } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipe, recipeIngredients } = useTracker(() => {
    if (verbose) { console.log('IndividualRecipe _id: ', _id); }
    const sub1 = Meteor.subscribe(Recipes.userPublicationName);
    const sub2 = Meteor.subscribe(RecipesIngredients.userPublicationName);

    // Determine if the subscriptions are ready
    const rdy = sub1.ready() && sub2.ready();

    const document = Recipes.collection.findOne(_id);
    if (verbose) {
      console.log('Recipes: ', Recipes.collection.find({}).fetch());
      console.log('Document: ', document);
    }
    // Get the list of ingredients (for the selected/passed recipe)
    const ingredientItems = RecipesIngredients.collection.find({ recipe: document.name }).fetch();
    if (verbose) {
      console.log('Recipe Name: ', document.name);
      console.log('RecipesIngredients: ', RecipesIngredients.collection.find({}).fetch());
      console.log('Ingredients: ', ingredientItems);
    }
    return {
      recipe: document,
      recipeIngredients: ingredientItems,
      ready: rdy,
    };
  }, [_id]);
  if (verbose) { console.log('Recipe: ', recipe, ' Ingredients: ', recipeIngredients); }
  return (ready ? (
    <Container className="py-3">
      <Card className="p-0">
        <Card.Header>
          <Card.Title>{recipe.name}</Card.Title>
          <Card.Subtitle>Submitted by: {recipe.owner}</Card.Subtitle>
          <Image src={recipe.image} fluid />
        </Card.Header>
        <Card.Body>
          <Col>
            <Row>
              <Card.Subtitle>Time: {recipe.time}, Serves: {recipe.servings}</Card.Subtitle>
            </Row>
            <Row>
              <Col><Card.Text>{recipe.instructions}</Card.Text></Col>
              <Col>
                <CardGroup>
                  <Col>
                    {recipeIngredients.map(recipeIngredient => <RecipeIngredient key={recipeIngredient._id} recipeIngredient={recipeIngredient} />)}
                  </Col>
                </CardGroup>
              </Col>
            </Row>
          </Col>
        </Card.Body>
      </Card>
    </Container>
  ) : <LoadingSpinner />);
};

export default IndividualRecipe;
