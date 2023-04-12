import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from './LoadingSpinner';
import { Vendors } from '../../api/vendors/Vendors';
import { Profiles } from '../../api/profiles/Profiles';

// Displays the individual vendor data for an ingredient
const VendorIngredientData = ({ vendorIngredient }) => {
  // Deconstruct object (so I dont have to keep typing longObjectName.field)
  const { address, ingredient, size, price } = vendorIngredient;
  const { ready, vendor } = useTracker(() => {
    // Subscribe to the collection
    const sub = Meteor.subscribe(Vendors.userPublicationName);
    // Get the name from the database
    const vendorItem = _.pluck(Vendors.collection.find({ address: address }).fetch(), 'name');
    return {
      ready: sub.ready(),
      vendor: vendorItem,
    };
  }, []);
  // Render the component
  return ready ? (
    <Row>
      <Col>
        <Row>{vendor} at {address}:</Row>
        <Row>{size} {ingredient} <Badge>${price}</Badge></Row>
      </Col>
    </Row>
  ) : <LoadingSpinner />;
};
VendorIngredientData.propTypes = {
  vendorIngredient: PropTypes.shape({
    address: String,
    ingredient: String,
    inStock: { type: Boolean, defaultValue: true },
    size: { type: String, defaultValue: 'whole' },
    price: { type: Number, defaultValue: 0.01 },
    // _id: PropTypes.string,
  }).isRequired,
};

// Displays each ingredient within a list as a card, with vendor data if it exists
const IndRecIngredientItem = ({ recipeIngredient, vendorIngredients }) => {
  // Deconstruct object (so I dont have to keep typing longObjectName.field)
  const { ingredient, size, quantity } = recipeIngredient;
  // Find relevant vendor data documents for the ingredient in the passed array
  const vendorIngredientData = vendorIngredients.find({ ingredient: ingredient }).fetch();
  // Get the email of the current user
  const email = Meteor.user().email;
  // Subscribe to the database before rendering
  const { ready, allergic } = useTracker(() => {
    const sub = Meteor.subscribe(Profiles.userPublicationName);
    // Extract the allergies field, which is an array of strings
    const allergies = _.pluck(Profiles.collection.find({ email: email }).fetch(), 'allergies');
    // Search the allergies array for the current ingredient (truthy if found)
    return {
      allergic: allergies.find(ingredient),
      ready: sub.ready(),
    };
  }, []);
  // The component to display the ingredient
  return ready ? (
    <Card bg={allergic ? 'danger' : 'light'}>
      <Card.Body>
        <Row className="flex-row">
          <Col>
            <Row>
              <Col>{ingredient}</Col>
              <Col>{size}</Col>
              <Col>{quantity}</Col>
            </Row>
            <Row>
              {vendorIngredientData.map(vendorIngredient => <VendorIngredientData vendorIngredient={vendorIngredient} />)}
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ) : <LoadingSpinner />;
};
IndRecIngredientItem.propTypes = {
  recipeIngredient: PropTypes.shape({
    recipe: String,
    ingredient: String,
    size: { type: String, defaultValue: 'whole' },
    quantity: { type: Number, defaultValue: 1 },
    // _id: PropTypes.string, may be useful for owner/admin later
  }).isRequired,
  vendorIngredients: PropTypes.arrayOf({
    address: String,
    ingredient: String,
    inStock: { type: Boolean, defaultValue: true },
    size: { type: String, defaultValue: 'whole' },
    price: { type: Number, defaultValue: 0.01 },
    // _id: PropTypes.string,
  }).isRequired,
};

// Displays and organizes the entire ingredient list for an individual recipe
/** This component takes all relevant data documents from a higher level component
 *   recipeIngredients all relate to THIS recipe, there should always at least be one
 *   vendorIngredients all relate to the ingredients of THIS recipe, if they exist */
const IndRecIngredientList = ({ recipeIngredients, vendorIngredients }) => (
  <Card>
    <Card.Body>
      <Col>
        {recipeIngredients.map(recipeIngredient => <IndRecIngredientItem recipeIngredient={recipeIngredient} vendorIngredients={vendorIngredients} />)}
      </Col>
    </Card.Body>
  </Card>
);
IndRecIngredientList.propTypes = {
  recipeIngredients: PropTypes.arrayOf({
    recipe: String,
    ingredient: String,
    size: { type: String, defaultValue: 'whole' },
    quantity: { type: Number, defaultValue: 1 },
    _id: PropTypes.string,
  }).isRequired,
  vendorIngredients: PropTypes.arrayOf({
    address: String,
    ingredient: String,
    inStock: { type: Boolean, defaultValue: true },
    size: { type: String, defaultValue: 'whole' },
    price: { type: Number, defaultValue: 0.01 },
    _id: PropTypes.string,
  }).isRequired,
};

export default IndRecIngredientList;
