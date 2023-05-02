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

const removeItem = ({ _id }) => {
  removeDoc(_id, VendorsIngredients);
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
    <Container className="py-3" id="vendor-profile-page">
      <Row className="d-flex justify-content-center">
        <Col className="col-3 text-center border-gradient off-white-background rounded-2 py-4" id="my-profile">
          <Container className="py-4">
            <Image className="square-img rounded-circle border border-white border-2" src={vendorData[0].image} />
          </Container>
          <h1>My Profile</h1>
          <h5>{ Meteor.user().username }</h5>
        </Col>
        <Col md={7} className="col-4 rounded-2">
          <Container>
            <Card id="vendor-information-card">
              <Card.Header className="py-2 d-flex align-content-center">
                <Card.Title>
                  Vendor Information
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup as="ol" variant="flush">
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Name:</div>
                    </div>
                    { vendorData[0].name }
                  </ListGroup.Item>

                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Address:</div>
                    </div>
                    { vendorData[0].address }
                  </ListGroup.Item>

                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Hours:</div>
                    </div>
                    { vendorData[0].hours }
                  </ListGroup.Item>

                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw"><Link to={`/edit_vendor_profile/${vendorData[0]._id}`}>Edit</Link>
                      </div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
      <br />
      <Row className="d-flex justify-content-center">
        <Col className="col-10 rounded-2">
          <Container>
            <Card id="vendor-information-card">
              <Card.Body>
                <Accordion>
                  <Accordion.Header id="vendor-profile-page">
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
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorIngredients.map((vendorIngredient) => <VendorIngredientList key={vendorIngredient._id} vendorIngredient={vendorIngredient} id={vendorIngredient._id} />)}
                      </tbody>
                    </Table>

                    <div className="ms-2 me-auto">
                      <div className="fw"><Link to={`/add_vendor_products/${vendorData[0]._id}`}>Add Ingredient</Link>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion>
              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default VendorProfile;
