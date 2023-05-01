import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Tab, Tabs, Button, Col, InputGroup, Card } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoField, AutoForm } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import AdminDataList from '../../components/lists/admin/AdminDataList';
import Profile from '../Profile';
import { collectionNames, resetAllMethod } from '../../../startup/both/Methods';

const bridge = new SimpleSchema2Bridge(new SimpleSchema({
  itemsInList: {
    type: Number,
    allowedValues: [10, 20, 50],
    defaultValue: 10,
  },
}));

/* This component is merely to organize all admin data */
const AdminHome = () => {
  // Index of the active pagination item
  const [numElements, setNumElements] = useState(10);
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
  const handleChange = (event) => {
    console.log(event);
  };
  return (
    <Container className="p-2 text-center" id="admin-page">
      <Tabs>
        <Tab eventKey="admin-profile" title="Profile"><Profile /></Tab>
        <Tab eventKey="dataDb" title="Server Data">
          <Card>
            <Col>
              <AutoForm schema={bridge}>
                <InputGroup className="align-items-center">
                  <Button onClick={handleClearDataButton} className="me-2">Reset all data to default</Button>
                  <InputGroup.Text>Items in List: </InputGroup.Text>
                  <AutoField name="itemsInList" label={null} className="mb-auto" inputClassName="rounded-0 rounded-end" onChange={handleChange} />
                </InputGroup>
              </AutoForm>
              <Tabs>
                {collectionNames.map(collectionName => (
                  <Tab style={{ maxHeight: '40vh', overflowY: 'auto' }} title={collectionName.replace('Collection', '')} eventKey={collectionName}>
                    <AdminDataList collectionName={collectionName} numElementsPerPage={numElements} />
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
