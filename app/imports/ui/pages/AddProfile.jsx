import React from 'react';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-bootstrap5';
import { Container, Col, Card, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { Profiles } from '../../api/profiles/Profiles';
import LoadingSpinner from '../components/LoadingSpinner';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allAllergies) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  vegan: { type: Boolean, label: 'Vegan', optional: true },
  glutenFree: { type: Boolean, label: 'Gluten free', optional: true },
  allergies: { type: Array, label: 'Allergies', optional: true },
  'allergies.$': { type: String, allowedValues: allAllergies },
});

/* Renders the Home Page: what appears after the user logs in. */
const AddProfile = () => {

  /* On submit, insert the data. */
  const submit = (data) => {
    Meteor.call(data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile updated successfully', 'success');
      }
    });
  };

  const { ready, email } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Profiles.userPublicationName);
    return {
      ready: sub1.ready(),
      email: Meteor.user()?.username,
    };
  }, []);
  // Create the form schema for uniforms. Need to determine all interests and projects for muliselect list.
  const allAllergies = _.pluck(Profiles.collection.find().fetch(), 'name');
  const formSchema = makeSchema(allAllergies);
  const bridge = new SimpleSchema2Bridge(formSchema);
  // Now create the model with all the user information.
  const profile = Profiles.collection.findOne({ email });
  const model = _.extend({}, profile, { allAllergies });
  return ready ? (
    <Container className="justify-content-center">
      <Col>
        <Col className="justify-content-center text-center"><h2>Your Profile</h2></Col>
        <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)}>
          <Card>
            <Card.Body>
              <TextField name="allergies" placeholder="Add any allergies..." />
              Vegan
              <Form.Select name="vegan">
                <option label="true">
                  { true }
                </option>
                <option label="false">
                  { false }
                </option>
              </Form.Select>
              Gluten Free
              <Form.Select name="glutenFree">
                <option label="true">
                  { true }
                </option>
                <option label="false">
                  { false }
                </option>
              </Form.Select>
              <SubmitField value="Submit" />
              <ErrorsField />
            </Card.Body>
          </Card>
        </AutoForm>
      </Col>
    </Container>
  ) : <LoadingSpinner />;
};

export default AddProfile;
