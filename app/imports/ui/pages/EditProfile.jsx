import React, { useState } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import SimpleSchema from 'simpl-schema';
import { Navigate } from 'react-router-dom';
import { Profiles } from '../../api/profiles/Profiles';
import LoadingSpinner from '../components/LoadingSpinner';

// const bridge = new SimpleSchema2Bridge(Profiles.schema);

/* Renders the EditStuff page for editing a single document. */
const EditProfile = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const [redirectToReferer, setRedirectToRef] = useState(false);
  // console.log('EditStuff', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Profiles.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);

  const schema = new SimpleSchema({
    email: { type: String, index: true, unique: true },
    vegan: {
      type: String, allowedValues: ['true', 'false'],
      defaultValue: 'false',
    },
    glutenFree: {
      type: String, allowedValues: ['true', 'false'],
      defaultValue: 'false',
    },
    allergies: {
      type: Array,
      minCount: 0,
      optional: true,
    },
    'allergies.$': String,
  });

  const bridge = new SimpleSchema2Bridge(schema);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { vegan, glutenFree, allergies } = data;

    let veganBool = false;
    let glutenFreeBool = false;
    if (vegan === 'true') {
      veganBool = true;
    }
    if (glutenFree === 'true') {
      glutenFreeBool = true;
    }

    Profiles.collection.update(_id, { $set: { vegan: veganBool, glutenFree: glutenFreeBool } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Profile updated successfully!', 'success')));

    // attempts to add allergy to list of allergies
    if (allergies.length !== 0) {
      Profiles.collection.update(_id, { $push: { allergies } }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
    }
    setRedirectToRef(true);
  };

  // redirect to user profile
  if (redirectToReferer) {
    return <Navigate to="/user-profile" />;
  }

  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Edit Profile</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body>
                <TextField name="allergies" placeholder="Add new allergy..." defaultValue="" />

                <SelectField id="edit-vegan" name="vegan" />

                <SelectField id="edit-glutenFree" name="glutenFree" />

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

export default EditProfile;
