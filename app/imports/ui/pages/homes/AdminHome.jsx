import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Tab, Tabs, Button, Col, Card } from 'react-bootstrap';
import swal from 'sweetalert';
import AdminDataList from '../../components/lists/admin/AdminDataList';
import Profile from '../Profile';
import { collectionNames, resetAllMethod } from '../../../startup/both/Methods';
import scrollableY from '../../helpers/CommonProps';

const AdminHome = () => {
  // The meteor method takes no parameters, so the object holding parameters is empty
  const handleClearDataButton = () => {
    Meteor.call(resetAllMethod, {}, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Collections reset successfully', 'success');
      }
    });
  };
  return (
    <Container className="p-2 text-center" id="admin-page">
      <Tabs>
        <Tab eventKey="admin-profile" title="Profile"><Profile /></Tab>
        <Tab eventKey="dataDb" title="Server Data">
          <Card>
            <Col>
              <Button onClick={handleClearDataButton} className="me-2">Reset all data to default</Button>
              <Tabs>
                {collectionNames.map(collectionName => (
                  <Tab
                    key={collectionName}
                    style={scrollableY}
                    title={collectionName.replace('Collection', '')}
                    eventKey={collectionName}
                  >
                    <AdminDataList collectionName={collectionName} />
                  </Tab>
                ))}
              </Tabs>
            </Col>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminHome;
