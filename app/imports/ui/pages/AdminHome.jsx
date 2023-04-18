import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import DataListsAdmin from '../components/DataListsAdmin';
import RelationListsAdmin from '../components/RelationListsAdmin';

/* This component is merely to organize all admin data */
const AdminHome = () => (
  <Container className="p-2 text-center">
    <Tabs>
      <Tab eventKey="dataDb" title="Data Collections">
        <DataListsAdmin />
      </Tab>
      <Tab eventKey="joinDb" title="Join Collections">
        <RelationListsAdmin />
      </Tab>
    </Tabs>
  </Container>
);

export default AdminHome;
