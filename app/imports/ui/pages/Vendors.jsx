import React from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';

/* A simple static component to render some text for the landing page. */
const Vendors = () => (
  <Container className="py-3">
    <Row className="justify-content-center">
      <Col>
        <Col className="text-center">
          <h2>Vendors</h2>
        </Col>
        <Row xs={1} md={2} lg={3} className="g-4">
          <Card style={{ width: '18rem' }}>
            {/* eslint-disable-next-line max-len */}
            <Card.Img variant="top" src="https://cdn.corporate.walmart.com/dims4/WMT/0b04aa6/2147483647/strip/true/crop/2400x1260+0+0/resize/1200x630!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2F6f%2Fd3%2Ff3f5a16f44a88d88b8059defd0a9%2Foption-signage.jpg" />
            <Card.Body>
              <Card.Title>Walmart</Card.Title>
              <Card.Text>
                <div>Address:</div>
                <div>700 Ke’eaumoku St</div>
                <div>Honolulu, HI 96814</div>
                <div />
                <div>Phone:</div>
                <div>(808) 955-8441</div>
                <div>Hours: M, T, W, Th, F, Sat, Sun: </div>
                <div>6 AM - 11 PM</div>
              </Card.Text>

            </Card.Body>
          </Card>
        </Row>
      </Col>
    </Row>
  </Container>
);

export default Vendors;
