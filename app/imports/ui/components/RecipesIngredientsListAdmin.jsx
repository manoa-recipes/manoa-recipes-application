import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from './LoadingSpinner';

const RecipeIngredientAdmin = ({ recipeIngredient }) => (
  <tr>
    <td className="text-start">{recipeIngredient._id}</td>
    <td>{recipeIngredient.recipe}</td>
    <td>{recipeIngredient.ingredient}</td>
    <td>{recipeIngredient.size}</td>
    <td>{recipeIngredient.quantity}</td>
  </tr>
);

// Require a document to be passed to this component.
RecipeIngredientAdmin.propTypes = {
  recipeIngredient: PropTypes.shape({
    recipe: PropTypes.string,
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

/* Admin and vendor page. */
const RecipesIngredientsListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipesIngredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(RecipesIngredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const recipesIngredientsItems = RecipesIngredients.collection.find({}).fetch();
    return {
      recipesIngredients: recipesIngredientsItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>RecipesIngredients Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>Recipe</th>
            <th>Ingredient</th>
            <th>Size</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {recipesIngredients.map((recipeIngredient) => <RecipeIngredientAdmin key={recipeIngredient._id} recipeIngredient={recipeIngredient} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

export default RecipesIngredientsListAdmin;
