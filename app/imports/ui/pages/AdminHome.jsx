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
      <Tab eventKey="tables" title="db Tables">
        <Col>
          <h2>Single Collections</h2>
          <Row>
            <Col><IngredientsListAdmin /><IngredientsAllergiesListAdmin /></Col>
            <Col><ProfilesListAdmin /><VendorsListAdmin /></Col>
          </Row>
          <Row><RecipesListAdmin /></Row>
          <Row><RecipesIngredientsListAdmin /></Row>
          <Row><VendorsIngredientsListAdmin /></Row>
        </Col>
      </Tab>
      <Tab eventKey="forms" title="db Tables: Forms" />
      <Tab eventKey="search" title="Search Test" />
    </Tabs>
  </Container>
);

export default AdminHome;
