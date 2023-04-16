import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Accordion, Badge, Card, Col, Row } from 'react-bootstrap';
import { Profiles } from '../../api/profiles/Profiles';
import LoadingSpinner from './LoadingSpinner';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import { Vendors } from '../../api/vendors/Vendors';

// A component to display an ingredients vendor data
const VendorIngredient = ({ vendorIngredient }) => {
  const { ready, vendor } = useTracker(() => {
    const sub = Meteor.subscribe(Vendors.userPublicationName);
    const rdy = sub.ready();
    return {
      vendor: _.pluck(Vendors.collection.find({ address: vendorIngredient.address }).fetch(), 'name'),
      ready: rdy,
    };
  }, []);
  return ready ? (
    <Row>
      <Col>{vendor}</Col>
      <Col><Badge bg="success">${vendorIngredient.price}</Badge></Col>
      <Col>{vendorIngredient.size}</Col>
      <Col>{vendorIngredient.ingredient}</Col>
    </Row>
  ) : <LoadingSpinner />;
};
VendorIngredient.propTypes = {
  vendorIngredient: PropTypes.shape({
    address: PropTypes.string,
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

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
  // Select an appropriate variant for the allergy warning
  const variant = allergic ? 'danger' : 'light';
  // Display the component for the ingredient
  return ready ? (
    <Card bg={variant} text={variant === 'light' ? 'dark' : 'white'}>
      <Accordion>
        <Card.Header className="bg-info">
          <Accordion.Header>
            <Row>
              <Col>{recipeIngredient.quantity}</Col>
              <Col>{recipeIngredient.size}</Col>
              <Col>{recipeIngredient.ingredient}</Col>
            </Row>
          </Accordion.Header>
        </Card.Header>
        <Card.Body>
          <Col>
            {vendorIngredients.length > 0 ? vendorIngredients.map(vendorIngredient => <VendorIngredient vendorIngredient={vendorIngredient} />) : <Row className="text-center"><p>No Vendor data</p></Row>}
          </Col>
        </Card.Body>
      </Accordion>
    </Card>
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
};
export default RecipeIngredient;
