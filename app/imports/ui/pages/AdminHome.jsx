import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import DataListsAdmin from '../components/admin/DataListsAdmin';
import RelationListsAdmin from '../components/admin/RelationListsAdmin';
import Profile from './Profile';

/* This component is merely to organize all admin data */
const AdminHome = () => (
  <Container className="p-2 text-center" id="admin-page">
    <Tabs>
      <Tab eventKey="admin-profile" title="Profile">
        <Profile />
      </Tab>
      <Tab eventKey="dataDb" title="Data Collections">
        <DataListsAdmin />
      </Tab>
      <Tab eventKey="joinDb" title="Join Collections">
        <RelationListsAdmin id="admin-join-collections" />
      </Tab>
    </Tabs>
  </Container>
);

export default AdminHome;
