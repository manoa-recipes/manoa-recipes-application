import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Badge, Card } from 'react-bootstrap';
import LoadingSpinner from '../LoadingSpinner';
import { Vendors } from '../../../api/vendors/Vendors';

// A component to display an ingredients vendor data
const RecipeVendorIngredient = ({ document }) => {
  const { ready, vendor } = useTracker(() => {
    const sub = Meteor.subscribe(Vendors.userPublicationName);
    const address = document?.address;
    const rdy = sub.ready();
    return {
      vendor: _.pluck(Vendors.collection.find({ address }).fetch(), 'name'),
      ready: rdy,
    };
  }, []);
  // If ready, render page, else show the loading spinner
  return ready ? (
    <Card.Text className="text-center">
      {vendor} <Badge bg="success">${document.price}</Badge> {document.size} {document.ingredient}
    </Card.Text>
  ) : <LoadingSpinner />;
};
RecipeVendorIngredient.propTypes = {
  document: PropTypes.shape({
    address: PropTypes.string,
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
export default RecipeVendorIngredient;
