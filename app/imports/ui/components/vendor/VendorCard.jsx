import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import VendorIngredient from './VendorIngredient';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const VendorCard = ({ vendor, vendorIngredients }) => (
  <Link to="/" className="recipeLink">
    <Card className="h-100">
      <div className="row g-0">
        <div className="col-md-6">
          <Card.Img src={vendor.image} className="vendorCard" style={{ height: '200px' }} />
        </div>
        <div className="col-md-6">
          <Card.Body>
            <Card.Title>{vendor.name}</Card.Title>
            <Card.Text>Address: {vendor.address}</Card.Text>
            <Card.Text>Hours: {vendor.hours}</Card.Text>
            <Card.Text>{vendorIngredients.map((vendorIngredient) => <VendorIngredient key={vendorIngredient._id} vendorIngredient={vendorIngredient} />)}
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    </Card>
  </Link>

);

// Require a document to be passed to this component.
VendorCard.propTypes = {
  vendor: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    hours: PropTypes.string,
    image: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,

  vendorIngredients: PropTypes.arrayOf(PropTypes.shape({
    address: PropTypes.string,
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  })).isRequired,
};

export default VendorCard;
