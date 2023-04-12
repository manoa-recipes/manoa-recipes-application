import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import DataListsAdmin from '../components/DataListsAdmin';
import RelationListsAdmin from '../components/RelationListsAdmin';
import IndividualRecipe from '../components/IndividualRecipe';

const testRecipe = {
  name: 'Default Salad',
  owner: 'jane@foo.com',
  image: '',
  instructions: 'Wash the lettuce and tomato thoroughly.  Assemble the chopped lettuce and tomato.  ',
  time: 10,
  servings: 2,
};

/* This component is merely to organize all admin data */
const AdminHome = () => (
  <Container className="p-0 text-center">
    <Tabs fill>
      <Tab eventKey="relaDb" title="Relational Collections">
        <RelationListsAdmin />
      </Tab>
      <Tab eventKey="dataDb" title="Data Collections">
        <DataListsAdmin />
      </Tab>
      <Tab eventKey="search" title="Search Test">
        <IndividualRecipe recipe={testRecipe} />
      </Tab>
    </Tabs>
  </Container>
);

export default AdminHome;
