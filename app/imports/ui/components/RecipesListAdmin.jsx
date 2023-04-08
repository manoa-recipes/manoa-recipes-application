import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Recipes } from '../../api/recipes/Recipes';
import LoadingSpinner from './LoadingSpinner';

const RecipeAdmin = ({ recipe }) => (
  <tr>
    <td className="text-start">{recipe._id}</td>
    <td>{recipe.name}</td>
    <td>{recipe.owner}</td>
    <td>{recipe.instructions}</td>
    <td>{recipe.time}</td>
    <td>{recipe.servings}</td>
  </tr>
);

// Require a document to be passed to this component.
RecipeAdmin.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    instructions: PropTypes.string,
    time: PropTypes.number,
    servings: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

/* Admin and vendor page. */
const RecipesListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipes } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Recipes.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const recipesItems = Recipes.collection.find({}).fetch();
    return {
      recipes: recipesItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>Recipes Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>name (*)</th>
            <th>owner</th>
            <th>instructions</th>
            <th>time</th>
            <th>servings</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => <RecipeAdmin key={recipe._id} recipe={recipe} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

export default RecipesListAdmin;
