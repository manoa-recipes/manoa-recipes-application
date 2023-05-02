import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const VendorIngredient = ({ vendorIngredient }) => (
  <tr>
    <td>{vendorIngredient.ingredient}</td>
    <td>{vendorIngredient.inStock ? 'True' : 'False'}</td>
    <td>{vendorIngredient.size}</td>
    <td>{vendorIngredient.price}</td>
  </tr>
);

// Require a document to be passed to this component.
VendorIngredient.propTypes = {
  vendorIngredient: PropTypes.shape({
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default VendorIngredient;
