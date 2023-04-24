import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container fluid id="landing-page">
    <Row className="d-flex align-middle text-center vh-100">
      <Col xs={8} id="landing-bg-1" className="border border-dark" />
      <Col xs={4} className="d-flex flex-column justify-content-center border border-dark" id="landing-bg-words">
        <h1>Welcome to Manoa Recipes!</h1>
      </Col>
    </Row>
    <Row className="d-flex align-middle text-center vh-100">
      <Col xs={4} className="d-flex flex-column justify-content-center border border-dark" id="landing-bg-words">
        <h1>Learn New College-Student-Friendly Recipes</h1>
      </Col>
      <Col xs={8} id="landing-bg-2" className="border border-dark" />
    </Row>
    <Row className="d-flex align-middle text-center vh-100">
      <Col xs={8} id="landing-bg-3" className="border border-dark" />
      <Col xs={4} className="d-flex flex-column justify-content-center border border-dark" id="landing-bg-words">
        <h1>Share Your Own Recipes</h1>
      </Col>
    </Row>
  </Container>
);

export default Landing;
