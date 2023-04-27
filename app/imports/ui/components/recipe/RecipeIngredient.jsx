import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import { Profiles } from '../../../api/profiles/Profiles';
import LoadingSpinner from '../LoadingSpinner';
import { VendorsIngredients } from '../../../api/vendors/VendorsIngredients';
import RecipeVendorIngredient from './RecipeVendorIngredient';

// A component to display an ingredient in a recipe, and distinguish when allergic
const RecipeIngredient = ({ recipeIngredient, index }) => {
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
  // Select an appropriate variant for the allergy warning
  const variant = allergic ? 'danger' : 'light';
  // Display the component for the ingredient
  return ready ? (
    <Accordion.Item
      className="p-0 g-0 m-0 bg-info"
      eventKey={index}
    >
      <Accordion.Header>{recipeIngredient.quantity} {recipeIngredient.size} {recipeIngredient.ingredient}</Accordion.Header>
      <Accordion.Body>
        {vendorIngredients.length > 0 ? vendorIngredients.map(vendorIngredient => (
          <RecipeVendorIngredient recipeVendorIngredient={vendorIngredient} />
        )) : <Row className="text-center">No Vendor data</Row>}
      </Accordion.Body>
    </Accordion.Item>
  ) : <LoadingSpinner />;
};

// Require a document to be passed to this component.
RecipeIngredient.propTypes = {
  recipeIngredient: PropTypes.shape({
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
export default RecipeIngredient;
