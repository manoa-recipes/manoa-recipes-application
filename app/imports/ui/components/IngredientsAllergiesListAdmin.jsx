import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { IngredientsAllergies } from '../../api/ingredients/IngredientsAllergies';
import LoadingSpinner from './LoadingSpinner';

const IngredientAllergyAdmin = ({ ingredientAllergy }) => (
  <tr>
    <td className="text-start">{ingredientAllergy._id}</td>
    <td>{ingredientAllergy.profile}</td>
    <td>{ingredientAllergy.ingredient}</td>
  </tr>
);

// Require a document to be passed to this component.
IngredientAllergyAdmin.propTypes = {
  ingredientAllergy: PropTypes.shape({
    profile: PropTypes.string,
    ingredient: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/* Admin and vendor page. */
const IngredientsAllergiesListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredientsAllergies } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(IngredientsAllergies.adminPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const ingredientsAllergiesItems = IngredientsAllergies.collection.find({}).fetch();
    return {
      ingredientsAllergies: ingredientsAllergiesItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>IngredientsAllergies Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>Profile</th>
            <th>Ingredient</th>
          </tr>
        </thead>
        <tbody>
          {ingredientsAllergies.map((ingredientAllergy) => <IngredientAllergyAdmin key={ingredientAllergy._id} ingredientAllergy={ingredientAllergy} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

export default IngredientsAllergiesListAdmin;
