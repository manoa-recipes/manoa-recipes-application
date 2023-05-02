import React, { useState } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Navigate } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import LoadingSpinner from '../components/LoadingSpinner';

/* Renders the EditStuff page for editing a single document. */
const AddVendorProducts = () => {
  const email = Meteor.user()?.username;
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const [redirectToReferer, setRedirectToRef] = useState(false);

  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(VendorsIngredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    return {
      ready: rdy,
    };
  }, []);

  const schema = new SimpleSchema({
    ingredient: String,
    inStock: { type: String, allowedValues: ['true', 'false'],
      defaultValue: 'false' },
    size: { type: String, defaultValue: 'whole' },
    price: { type: Number, defaultValue: 0.01 },
  });

  const bridge = new SimpleSchema2Bridge(schema);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { ingredient, inStock, size, price } = data;

    console.log(`inStock = ${inStock}`);

    let inStockBool = false;
    if (inStock === 'true') {
      inStockBool = true;
    }

    const address = 'none';

    VendorsIngredients.collection.insert({ email, address, ingredient, inStockBool, size, price }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Ingredient added successfully!', 'success')));

    setRedirectToRef(true);
  };

  // redirect to vendor profile
  if (redirectToReferer) {
    return <Navigate to="/vendor-profile" />;
  }

  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h2>Add A Product</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col><TextField name="ingredient" /></Col>
                  <Col><SelectField name="inStock" /></Col>
                </Row>
                <Row>
                  <Col><TextField name="size" /></Col>
                  <Col><TextField name="price" /></Col>
                </Row>
                <SubmitField value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default AddVendorProducts;
