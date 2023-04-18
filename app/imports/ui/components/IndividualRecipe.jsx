import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { Card, CardGroup, Row, Col, Container, Image, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import LoadingSpinner from './LoadingSpinner';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import RecipeIngredient from './RecipeIngredient';
import { Recipes } from '../../api/recipes/Recipes';

// This page/component displays ALL data related to a specific recipe
const IndividualRecipe = () => {
  const { _id } = useParams();
  console.log('IndividualRecipe:\n  _id: ', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipe, recipeIngredients, editAccess } = useTracker(() => {
    const sub1 = Meteor.subscribe(Recipes.userPublicationName);
    const sub2 = Meteor.subscribe(RecipesIngredients.userPublicationName);

    // Determine if the subscriptions are ready
    const rdy = sub1.ready() && sub2.ready();

    const document = Recipes.collection.findOne(_id);
    /* For editAccess */
    const isAdmin = (Meteor.userId() !== null) ? Roles.userIsInRole(Meteor.userId(), 'admin') : false;
    /* For editAccess */
    const isOwner = ((Meteor.userId() !== null ? Meteor.user()?.username : 'tempUser') === (document ? document.owner : 'tempOwner'));
    // RecipesIngredients documents
    const ingredientItems = document ? RecipesIngredients.collection.find({ recipe: document.name }).fetch() : [];
    console.log('useTracker collections:\n  Recipes: ', Recipes.collection.find({}).fetch(), '\n  Recipe: ', document, '\n  Ingredients: ', ingredientItems);
    return {
      recipe: document,
      recipeIngredients: ingredientItems,
      editAccess: isAdmin || isOwner,
      ready: rdy,
    };
  }, [_id]);
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
          {editAccess ? (<Button href={`/edit-recipe/${recipe._id}`}>Edit</Button>) : ''}
        </Card.Body>
      </Card>
    </Container>
  ) : <LoadingSpinner />);
};

export default IndividualRecipe;
