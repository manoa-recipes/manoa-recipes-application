import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { Row, Col, Container, Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner';
import { RecipesIngredients } from '../../../api/recipes/RecipesIngredients';
import { Recipes } from '../../../api/recipes/Recipes';
import RecipeInfo from '../../components/recipe/RecipeInfo';
import RecipeIngredient from '../../components/recipe/RecipeIngredient';

// This page/component displays ALL data related to a specific recipe
const ViewRecipe = () => {
  const { _id } = useParams();
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
    // console.log('useTracker collections:\n  Recipes: ', Recipes.collection.find({}).fetch(), '\n  Recipe: ', document, '\n  Ingredients: ', ingredientItems);
    return {
      recipe: document,
      recipeIngredients: ingredientItems,
      editAccess: isAdmin || isOwner,
      ready: rdy,
    };
  }, [_id]);
  const scroller = { maxHeight: '50vh', overflowY: 'auto' };
  // Its about 30 characters per line
  return (ready ? (
    <Container>
      <Row xs={1} sm={1} md={1} lg={3} className="grid m-auto g-0 justify-content-center">
        <Col
          xs={{ order: '1' }}
          className="text-center w-auto m-auto"
        >
          {editAccess ? (
            <Button
              className="rounded-0 rounded-top"
              href={`/edit-recipe/${recipe._id}`}
            >
              Edit
            </Button>
          ) : ''}
          <RecipeInfo recipe={recipe} />
        </Col>
        <Col
          xs={{ order: '2' }}
          md={{ order: '3' }}
          lg={{ order: '2' }}
          className="mt-lg-5"
          style={{ width: '18rem' }}
        >
          <Card>
            <Card.Header>Ingredients:</Card.Header>
            <Col style={scroller}>
              {recipeIngredients.map(recipeIngredient => (
                <RecipeIngredient key={recipeIngredient._id} recipeIngredient={recipeIngredient} />
              ))}
            </Col>
          </Card>
        </Col>
        <Col
          xs={{ order: '3' }}
          md={{ order: '2' }}
          lg={{ order: '3' }}
          className="m-auto h-auto mt-lg-5"
          style={{ width: '18rem' }}
        >
          <Card>
            <Card.Header>Instructions: {recipe.instructions.length}</Card.Header>
            <Card.Text className="m-0 p-2" style={scroller}>{recipe.instructions}</Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ViewRecipe;
