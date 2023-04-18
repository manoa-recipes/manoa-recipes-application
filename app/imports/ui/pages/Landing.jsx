import React from 'react';
import { Col, Row } from 'react-bootstrap';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id="landing-page">
    <Row fluid className="align-middle text-center vh-100 vw-100">
      <Col xs={8} id="landing-bg-1" className="border border-dark" />
      <Col xs={4} className="d-flex flex-column justify-content-center border border-dark" id="landing-bg-words">
        <h1>Welcome to Manoa Recipes!</h1>
      </Col>
    </Row>
    <Row className="align-middle text-center vh-100 vw-100">
      <Col xs={4} className="d-flex flex-column justify-content-center border border-dark" id="landing-bg-words">
        <h1>Learn New College-Student-Friendly Recipes</h1>
      </Col>
      <Col xs={8} id="landing-bg-2" className="border border-dark" />
    </Row>
    <Row className="align-middle text-center vh-100 vw-100">
      <Col xs={8} id="landing-bg-3" className="border border-dark" />
      <Col xs={4} className="d-flex flex-column justify-content-center border border-dark" id="landing-bg-words">
        <h1>Share Your Own Recipes</h1>
      </Col>
    </Row>
  </div>
);

export default Landing;
