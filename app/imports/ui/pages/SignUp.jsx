import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { Roles } from 'meteor/alanning:roles';
import { useParams } from 'react-router';
import { Profiles } from '../../api/profiles/Profiles';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = ({ location }) => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    email: String,
    password: String,
    role: {
      type: String, allowedValues: ['user', 'vendor'],
      defaultValue: 'user',
    },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const assignRoles = (userId, role) => {
    console.log(userId);
    console.log('creating role');
    Roles.createRole(role, { unlessExists: true });
    console.log('Roles.createRole worked');
    Roles.addUsersToRoles(userId, role);
    console.log('Roles.addUsersToRoles worked');
  };

  // Add user to the Meteor accounts.
  /* function createUser(email, role) {
    console.log(`  createUser(${email}, ${role})`);
    const userID = Accounts.createUser({ username: email, email, password: 'changeme' });
    if (role === 'admin') { promoteUser(userID, role); }
    if (role === 'vendor') { promoteUser(userID, role); }

    // adding user role
    if (role === 'user') { promoteUser(userID, role); }
  } */

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const { email, password, role } = doc;

    Accounts.createUser({ username: email, email, password: password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        console.log(role);
        console.log('before Profiles.insert');
        if (role === 'user') {
          console.log(`this.userId = ${this.userId}`);
          console.log('Profiles.collection.insert making profile');
          Profiles.collection.insert({ email: email, vegan: false, glutenFree: false, allergies: [] });
        }
        setRedirectToRef(true);
      }
    });

    console.log('making roles');
    // if (role === 'vendor') { assignRoles(_id, role); }

    // adding user role
    // if (role === 'user') { assignRoles(_id, role); }

    // console.log(Meteor.user);
    // console.log(role);
    // assignRoles(Meteor.userId, role);
    /* Accounts.onCreateUser((options, user) => {
      console.log('on create user');
      assignRoles(userId, role);
    }); */
    // console.log(Meteor.userId());
    // assignRoles(newUser, role);
  };

  /* Display the signup form. Redirect to add user profile page after successful registration and login. */
  const { from } = location?.state || { from: { pathname: '/home' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Navigate to={from} />;
  }
  return (
    <Container fluid id="signup-page" className="">
      <Row md={3}>
        <Col md={3}>
          <Col id="text-sign-up" className="text-center">
            <h4>Register your account</h4>
          </Col>
          <AutoForm schema={bridge} onSubmit={(data) => submit(data)}>
            <Card id="card-signin-signup">
              <Card.Body>
                <TextField id="card-signup-email" name="email" placeholder="E-mail address" />
                <TextField id="card-signup-password" name="password" placeholder="Password" type="password" />
                <SelectField id="card-signin-signup" name="role" />
                <SubmitField id="signup-form-submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert variant="light">
            Already have an account? Login
            {' '}
            <Link to="/signin">here</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
SignUp.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
  }),
};

SignUp.defaultProps = {
  location: { state: '' },
};

export default SignUp;
