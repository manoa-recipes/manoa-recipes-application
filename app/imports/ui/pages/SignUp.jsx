import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = ({ location }) => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    email: String,
    password: String,
    isVendor: { type: String, allowedValues: ['vendor', ''] },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    const { email, password, isVendor } = doc;
    const profile = { role: isVendor };
    Accounts.createUser({ email, username: email, password, profile }, (err) => {
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
    <Container fluid id="signup-page" className="py-3">
      <Row id="row-c">
        <Col md={3}>
          <Col id="text-sign-in" className="text-center">
            <h4>Register your account</h4>
          </Col>
          <AutoForm schema={bridge} onSubmit={(data) => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id="card-rounder" name="email" placeholder="E-mail address" />
                <TextField id="card-rounder" name="password" placeholder="Password" type="password" />
                <SelectField
                  id="card-rounder"
                  name="isVendor"
                  label="Sign up as a vendor?"
                  options={[
                    { label: 'No', value: 'customer' },
                    { label: 'Yes', value: 'vendor' },
                  ]}
                />
                <ErrorsField />
                <SubmitField />
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
        <Col id="sign-in-background" />
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
