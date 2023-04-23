import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const VendorItem = ({ item }) => (
  <tr>
    <td>{item.ingredient}</td>
    <td>{item.size}</td>
    <td>{item.price}</td>
  </tr>
);

// Require a document to be passed to this component.
VendorItem.propTypes = {
  item: PropTypes.shape({
    ingredient: PropTypes.string,
    size: PropTypes.number,
    price: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default VendorItem;
