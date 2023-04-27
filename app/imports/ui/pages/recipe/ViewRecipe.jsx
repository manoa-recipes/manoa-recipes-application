import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner';
import { RecipesIngredients } from '../../../api/recipes/RecipesIngredients';
import { Recipes } from '../../../api/recipes/Recipes';
import RecipeCard from '../../components/recipe/RecipeCard';
import RecipeInstructions from '../../components/recipe/RecipeInstructions';
import RecipeIngredientList from '../../components/recipe/RecipeIngredientList';

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
  return (ready ? (
    <Container className="p-2">
      <Col className="p-0">
        {editAccess ? (<Button className="rounded-0 rounded-top" href={`/edit-recipe/${recipe._id}`}>Edit</Button>) : ''}
        <Row className="grid bg-primary">
          <Col xs={3} className="bg-black w-auto m-auto">
            <RecipeCard recipe={recipe} />
          </Col>
          <Col
            xs={3}
            className="bg-dark w-auto m-auto h-auto"
            style={{ maxHeight: '50vh', overflowY: 'auto' }}
          >
            <Row><RecipeIngredientList recipeIngredients={recipeIngredients} /></Row>
            <Row><RecipeInstructions instructions={recipe.instructions} /></Row>
          </Col>
        </Row>
      </Col>
    </Container>
  ) : <LoadingSpinner />);
};

export default ViewRecipe;
