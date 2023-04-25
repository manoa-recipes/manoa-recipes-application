import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import { Vendors } from '../../api/vendors/Vendors';
import StuffItem from '../components/VendorItem';
import LoadingSpinner from '../components/LoadingSpinner';
import PropTypes from 'prop-types';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListVendorItems = ({ vendorIngredient }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, vendor } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Vendors.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    return {
      vendor: _.pluck(Vendors.collection.find({ address: vendorIngredient.address }).fetch(), 'name'),
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>List Stuff</h2>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {vendor.map((stuff) => <StuffItem key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};
ListVendorItems.propTypes = {
  vendorIngredient: PropTypes.shape({
    address: PropTypes.string,
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default ListVendorItems;
