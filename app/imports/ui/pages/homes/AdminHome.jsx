import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Tab, Tabs, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import DataListsAdmin from '../../components/lists/admin/DataListsAdmin';
import JoinListsAdmin from '../../components/lists/admin/JoinListsAdmin';
import Profile from '../Profile';
import { clearDatabases } from '../../../startup/both/Methods';

/* This component is merely to organize all admin data */
const AdminHome = () => {
  const handleClearDataButton = (event) => {
    Meteor.call(clearDatabases, { event }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe updated successfully', 'success');
      }
    });
  };
  return (
    <Container className="p-2 text-center" id="admin-page">
      <Button onClick={(e) => handleClearDataButton(e)}>Clear Data (Except Profiles)</Button>
      <Tabs>
        <Tab eventKey="admin-profile" title="Profile">
          <Profile />
        </Tab>
        <Tab eventKey="dataDb" title="Data Collections">
          <DataListsAdmin />
        </Tab>
        <Tab eventKey="joinDb" title="Join Collections">
          <JoinListsAdmin id="admin-join-collections" />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminHome;
