import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import LoadingSpinner from './LoadingSpinner';

// A List-Item for a document from the VendorsIngredients collection
const VendorIngredientAdmin = ({ vendorIngredient }) => (
  <tr>
    <td className="text-start">{vendorIngredient._id}</td>
    <td>{vendorIngredient.address}</td>
    <td>{vendorIngredient.ingredient}</td>
    <td>{vendorIngredient.inStock ? 'True' : 'False'}</td>
    <td>{vendorIngredient.size}</td>
    <td>{vendorIngredient.price}</td>
  </tr>
);
VendorIngredientAdmin.propTypes = {
  vendorIngredient: PropTypes.shape({
    address: PropTypes.string,
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

// A List for all documents from the VendorsIngredients collection
const VendorsIngredientsListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, vendorsIngredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(VendorsIngredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const vendorsIngredientsItems = VendorsIngredients.collection.find({}).fetch();
    return {
      vendorsIngredients: vendorsIngredientsItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>VendorsIngredients Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>address</th>
            <th>ingredient</th>
            <th>inStock</th>
            <th>size</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {vendorsIngredients.map((vendorIngredient) => <VendorIngredientAdmin key={vendorIngredient._id} vendorIngredient={vendorIngredient} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

export default VendorsIngredientsListAdmin;
