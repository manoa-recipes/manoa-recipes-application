import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Vendors } from '../../api/vendors/Vendors';
import LoadingSpinner from './LoadingSpinner';

const VendorAdmin = ({ vendor }) => (
  <tr>
    <td className="text-start">{vendor._id}</td>
    <td>{vendor.name}</td>
    <td>{vendor.address}</td>
  </tr>
);

// Require a document to be passed to this component.
VendorAdmin.propTypes = {
  vendor: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/* List of Vendors (Admin view). */
const VendorsListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, vendors } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Vendors.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const vendorsItems = Vendors.collection.find({}).fetch();
    return {
      vendors: vendorsItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>Vendors Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>address (*)</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => <VendorAdmin key={vendor._id} vendor={vendor} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

export default VendorsListAdmin;
