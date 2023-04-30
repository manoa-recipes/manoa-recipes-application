import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Accordion, Card } from 'react-bootstrap';
import { Profiles } from '../../../api/profiles/Profiles';
import LoadingSpinner from '../LoadingSpinner';
import { VendorsIngredients } from '../../../api/vendors/VendorsIngredients';
import RecipeVendorIngredient from './RecipeVendorIngredient';

// A component to display an ingredient in a recipe, and distinguish when allergic
const RecipeIngredient = ({ recipeIngredient }) => {
  // Get the email of the current user
  const email = Meteor.user().email;
  // Subscribe to the database before rendering
  const { ready, allergic, vendorIngredients } = useTracker(() => {
    const sub = Meteor.subscribe(Profiles.userPublicationName);
    const sub2 = Meteor.subscribe(VendorsIngredients.userPublicationName);
    const rdy = sub.ready() && sub2.ready();

    // Pluck the allergies field from the logged in user's Profile document, which is an array of strings
    const allergies = _.pluck(Profiles.collection.find({ email: email }).fetch(), 'allergies');
    // Retrieve all vendor documents relating to this ingredient
    const vendorIngredientItems = VendorsIngredients.collection.find({ ingredient: recipeIngredient.ingredient }).fetch();
    return {
      // (bool) allergies array includes() the current ingredient
      allergic: allergies.includes(recipeIngredient.ingredient),
      vendorIngredients: vendorIngredientItems,
      ready: rdy,
    };
  }, []);
  if (!ready) { return (<LoadingSpinner />); }
  // Select an appropriate variant for the allergy warning
  const variant = allergic ? 'danger' : 'light';
  const textColor = allergic ? 'text-white' : 'text-dark';
  const numPrices = vendorIngredients.length;
  // Display the component for the ingredient
  const text = (recipeIngredient.quantity > 1) ? (
    `${recipeIngredient.quantity} ${recipeIngredient.size} ${recipeIngredient.ingredient}`
  ) : (
    `${recipeIngredient.size} ${recipeIngredient.ingredient}`
  );
  return (numPrices > 0) ? (
    <Accordion>
      <Accordion.Header>{text}</Accordion.Header>
      <Accordion.Body>
        {vendorIngredients.map(document => (
          <RecipeVendorIngredient document={document} />
        ))}
      </Accordion.Body>
    </Accordion>
  ) : (<Card.Text className="p-2 m-auto">{text}</Card.Text>);
};

// Require a document to be passed to this component.
RecipeIngredient.propTypes = {
  recipeIngredient: PropTypes.shape({
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
export default RecipeIngredient;
