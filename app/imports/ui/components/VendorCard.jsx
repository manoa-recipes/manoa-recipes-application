import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const VendorCard = ({ vendor }) => (
  <Card style={{ width: '18rem' }} className="h-100">
    <Card.Title className="px-3">{vendor.name}</Card.Title>
    <Card.Subtitle className="px-3">{vendor.address}</Card.Subtitle>
    <Card.Body>{vendor.hours}</Card.Body>
  </Card>

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
};

export default VendorCard;
