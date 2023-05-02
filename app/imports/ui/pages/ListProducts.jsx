import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Card, ListGroup, Image, Accordion, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import { removeDoc } from '../../startup/both/DocumentHelpers';

const removeItem = ({ vendorIngredient }) => {
  console.log(`remove clicked id = ${vendorIngredient._id}`);
  removeDoc(vendorIngredient._id, VendorsIngredients);
};

const VendorIngredientList = ({ vendorIngredient }) => (
  <tr>
    <td>{vendorIngredient.ingredient}</td>
    <td>{vendorIngredient.inStock ? 'True' : 'False'}</td>
    <td>{vendorIngredient.size}</td>
    <td>{vendorIngredient.price}</td>
    <td>
      <div className="ms-2 me-auto">
        <div className="fw"><Link to={`/edit_vendor_products/${vendorIngredient._id}`}>Edit</Link>
        </div>
      </div>
    </td>
    <td>
      <Button
        id="remove"
        variant="danger"
        onClick={() => removeItem(vendorIngredient)}
      >
        -
      </Button>
    </td>
  </tr>
);

VendorIngredientList.propTypes = {
  vendorIngredient: PropTypes.shape({
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const VendorProfile = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ready2, vendorData, vendorIngredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Vendors.userPublicationName);
    const subscription2 = Meteor.subscribe(VendorsIngredients.userPublicationName);

    // Determine if the subscription is ready
    const rdy = subscription.ready();
    const rdy2 = subscription2.ready();

    // Get the vendor profile document
    const user = (Meteor.userId() !== null) ? Meteor.user()?.username : 'tempUser';
    const vendorProfile = Vendors.collection.find({ email: user }).fetch();
    const vendorStuff = VendorsIngredients.collection.find({ email: user }).fetch();

    return {
      vendorData: vendorProfile,
      vendorIngredients: vendorStuff,
      ready: rdy,
      ready2: rdy2,
    };
  }, []);

  return (ready, ready2 ? (
    <Container>
      <tr>
        <td>{vendorIngredient.ingredient}</td>
        <td>{vendorIngredient.inStock ? 'True' : 'False'}</td>
        <td>{vendorIngredient.size}</td>
        <td>{vendorIngredient.price}</td>
        <td>
          <div className="ms-2 me-auto">
            <div className="fw"><Link to={`/edit_vendor_products/${vendorIngredient._id}`}>Edit</Link>
            </div>
          </div>
        </td>
        <td>
          <Button
            id="remove"
            variant="danger"
            onClick={() => removeItem(vendorIngredient)}
          >
            -
          </Button>
        </td>
      </tr>
    </Container>
};

export default VendorProfile;
