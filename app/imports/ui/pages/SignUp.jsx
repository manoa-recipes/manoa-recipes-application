import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { Roles } from 'meteor/alanning:roles';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = ({ location }) => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    email: String,
    password: String,
    role: { type: String, allowedValues: ['vendor', ''], defaultValue: '' },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    const { email, password, role } = doc;
    const userID = Accounts.createUser({ email, username: email, password, role }, (err) => {
      if (role === 'vendor') {
        Roles.createRole(role, { unlessExists: true });
        Roles.addUsersToRoles(userID, 'vendor');
      }
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
  };

  const { from } = location?.state || { from: { pathname: '/add' } };
  if (redirectToReferer) {
    return <Navigate to={from} />;
  }

  return (
    <Container fluid id="signup-page" className="">
      <Row id="row-c">
        <Col md={3}>
          <Col id="text-sign-up" className="text-center">
            <h4>Register your account</h4>
          </Col>
          <AutoForm schema={bridge} onSubmit={(data) => submit(data)}>
            <Card id="card-color">
              <Card.Body>
                <TextField id="card-rounder" name="email" placeholder="E-mail address" />
                <TextField id="card-rounder" name="password" placeholder="Password" type="password" />
                <SelectField name="role" />
                <SubmitField />
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
        <Col id="sign-up-background" />
      </Row>
    </Container>
  );
};

SignUp.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }),
};

SignUp.defaultProps = {
  location: { state: {} },
};

export default SignUp;
