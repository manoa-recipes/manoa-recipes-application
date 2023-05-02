import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Table } from 'react-bootstrap';
import VendorIngredient from './VendorIngredient';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const VendorCard = ({ vendor, vendorIngredients }) => {
  const [activeAccord, setActiveAccord] = useState({});

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

  const handleAccordClick = (id) => {
    if (activeAccord === id) {
      setActiveAccord(null);
    } else {
      setActiveAccord(id);
    }
  };
  return (
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
          </Card.Body>
        </div>
        <Card.Footer>
          <Accordion>
            <Accordion.Header onClick={() => handleAccordClick(card.id)}>
              <h5>Products</h5>
            </Accordion.Header>
            <Accordion.Body>
              <Table striped bordered variant="light">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>In Stock</th>
                    <th>Size</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorIngredients.map((vendorIngredient) => <VendorIngredient key={vendorIngredient._id} vendorIngredient={vendorIngredient} />)}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion>
        </Card.Footer>
      </div>
    </Card>
  );
};

// Require a document to be passed to this component

export default VendorCard;
