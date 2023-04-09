import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Ingredients } from '../../api/ingredients/Ingredients';
import LoadingSpinner from './LoadingSpinner';

const IngredientAdmin = ({ ingredient }) => (
  <tr>
    <td>{ingredient._id}</td>
    <td>{ingredient.name}</td>
  </tr>
);

// Require a document to be passed to this component.
IngredientAdmin.propTypes = {
  ingredient: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/* Admin and vendor page. */
const IngredientsListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Ingredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const ingredientItems = Ingredients.collection.find({}).fetch();
    return {
      ingredients: ingredientItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>Ingredients Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>Name (*)</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => <IngredientAdmin key={ingredient._id} ingredient={ingredient} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

export default IngredientsListAdmin;
