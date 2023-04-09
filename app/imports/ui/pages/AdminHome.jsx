import React from 'react';
import { Col, Row, Container, Tab, Tabs } from 'react-bootstrap';
import IngredientsListAdmin from '../components/IngredientsListAdmin';
import IngredientsAllergiesListAdmin from '../components/IngredientsAllergiesListAdmin';
import ProfilesListAdmin from '../components/ProfilesListAdmin';
import VendorsListAdmin from '../components/VendorsListAdmin';
import RecipesListAdmin from '../components/RecipesListAdmin';
import RecipesIngredientsListAdmin from '../components/RecipesIngredientsListAdmin';
import VendorsIngredientsListAdmin from '../components/VendorsIngredientsListAdmin';

/* Organize all admin data tables */
const AdminHome = () => (
  <Container className="p-0 text-center">
    <Tabs fill>
      <Tab eventKey="datadb" title="Data Collections">
        <Row>
          <Col><IngredientsListAdmin /></Col>
          <Col><ProfilesListAdmin /><VendorsListAdmin /></Col>
        </Row>
        <Row><RecipesListAdmin /></Row>
      </Tab>
      <Tab eventKey="reladb" title="Relational Collections">
        <Col>
          <Row><IngredientsAllergiesListAdmin /></Row>
          <Row><RecipesIngredientsListAdmin /></Row>
          <Row><VendorsIngredientsListAdmin /></Row>
        </Col>
      </Tab>
      <Tab eventKey="search" title="Search Test" />
    </Tabs>
  </Container>
);

export default AdminHome;
