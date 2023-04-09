import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import DataListsAdmin from '../components/DataListsAdmin';
import RelationListsAdmin from '../components/RelationListsAdmin';

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
      <Tab eventKey="search" title="Search Test" />
    </Tabs>
  </Container>
);

export default AdminHome;
