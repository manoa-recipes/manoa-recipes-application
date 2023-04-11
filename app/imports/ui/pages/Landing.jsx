import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id="landing-page">
    <Row className="align-middle text-center">
      <Col xs={8}>
        <Image src="/images/gnocchi-bake.jpg" className="border border-dark" />
      </Col>
      <Col xs={4} className="d-flex flex-column justify-content-center">
        <h1>Welcome!</h1>
      </Col>
    </Row>
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image roundedCircle src="/images/manoa-recipes.png" width="150px" />
      </Col>

      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1>Welcome to this template</h1>
        <p>Now get to work and modify this app!</p>
      </Col>

    </Row>
  </div>
);

export default Landing;
