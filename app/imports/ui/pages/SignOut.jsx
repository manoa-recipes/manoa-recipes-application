import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    Meteor.logout();
    setTimeout(() => {
      setRedirect(true);
    }, 5000); // 5 second delay before redirecting
  }, []);

  return (
    <Col id="signout-page" className="text-center py-3">
      <h2>You are signed out.</h2>
      <h3>You will be redirected to the login page in 5 seconds...</h3>
      <h3>Thank you for using our app!</h3>
      {redirect && <Navigate to="/signin" />}
    </Col>
  );
};

export default SignOut;
