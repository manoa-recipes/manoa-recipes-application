import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3" id="nav">
    <Container fluid>
      <Row className="text-center" id="text">
        <Col className="text-center">
          <strong>CONTACT</strong>
          <hr />
          <div>
            Maya Chang - <em>mcc9@hawaii.edu</em>
            <br />
            Jianlong Chen - <em>jianlong@hawaii.edu</em>
            <br />
            Lisa Cheng - <em>chenlis@hawaii.edu</em>
            <br />
            Melvin Iwamoto - <em>melvinti@hawaii.edu</em>
            <br />
            Adrienne Kaneshiro - <em>amkanesh@hawaii.edu</em>
            <br />
          </div>
        </Col>
        <Col>
          <strong>LOCATION</strong>
          <hr />
          <div>
            Department of Information and Computer Sciences
            {' '}
            <br />
            University of Hawaii
            <br />
            Honolulu, HI 96822
            {' '}
            <br />
            <a href="https://manoa-recipes.github.io/" className="text-decoration-none">
              Home Page
            </a>
          </div>
        </Col>
        <Col>
          <strong>HELP</strong>
          <hr />
          <div>
            Q&A / FAQ
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
