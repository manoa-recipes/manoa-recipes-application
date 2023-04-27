import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Badge, Col, Row } from 'react-bootstrap';
import LoadingSpinner from '../LoadingSpinner';
import { Vendors } from '../../../api/vendors/Vendors';

// A component to display an ingredients vendor data
const RecipeVendorIngredient = ({ recipeVendorIngredient }) => {
  const { ready, vendor } = useTracker(() => {
    const sub = Meteor.subscribe(Vendors.userPublicationName);
    const rdy = sub.ready();
    return {
      vendor: _.pluck(Vendors.collection.find({ address: recipeVendorIngredient.address }).fetch(), 'name'),
      ready: rdy,
    };
  }, []);
  // If ready, render page, else show the loading spinner
  return ready ? (
    <Row>
      <Col>{vendor}</Col>
      <Col><Badge bg="success">${recipeVendorIngredient.price}</Badge></Col>
      <Col>{recipeVendorIngredient.size}</Col>
      <Col>{recipeVendorIngredient.ingredient}</Col>
    </Row>
  ) : <LoadingSpinner />;
};
RecipeVendorIngredient.propTypes = {
  recipeVendorIngredient: PropTypes.shape({
    address: PropTypes.string,
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
export default RecipeVendorIngredient;
