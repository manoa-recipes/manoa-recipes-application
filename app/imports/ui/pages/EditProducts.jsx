import React, { useState } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import LoadingSpinner from '../components/LoadingSpinner';

/* Renders the EditStuff page for editing a single document. */
const EditVendorProducts = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const [redirectToReferer, setRedirectToRef] = useState(false);
  // console.log('EditContact', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(VendorsIngredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = VendorsIngredients.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);

  const schema = new SimpleSchema({
    email: String,
    address: String,
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

    let inStockBool = false;
    if (inStock === 'true') {
      inStockBool = true;
    }

    VendorsIngredients.collection.update(_id, { $set: { ingredient: ingredient, inStock: inStockBool, size: size, price: price } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));

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
          <Col className="text-center"><h2>Edit Products</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
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

export default EditVendorProducts;
