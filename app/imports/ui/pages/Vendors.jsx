import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import VendorCard from '../components/vendor/VendorCard';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const VendorList = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, vendors, vendorIngredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Vendors.userPublicationName);
    const subscription2 = Meteor.subscribe(VendorsIngredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready() && subscription2.ready();
    // Get the Stuff documents
    const vendorList = Vendors.collection.find({}).fetch();
    const vendorStuff = VendorsIngredients.collection.find({}).fetch();
    return {
      vendors: vendorList,
      vendorIngredients: vendorStuff,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3" id="vendor-page">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Vendors</h2>
            <h4><i>Click on &apos;sProducts&apos;s to see what&apos;s in stock.</i></h4>
          </Col>
          <Row xs={1} md={2} lg={3} className="g-4">
            {vendors.map((vendor) => (<Col key={vendor._id}><VendorCard vendor={vendor} vendorIngredients={vendorIngredients.filter(vendorIngredient => (vendorIngredient.address === vendor.address))} /></Col>))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default VendorList;
