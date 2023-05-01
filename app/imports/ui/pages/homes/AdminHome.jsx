import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Tab, Tabs, Button, Col, InputGroup, Card } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import AdminDataList from '../../components/lists/admin/AdminDataList';
import Profile from '../Profile';
import { collectionNames, resetAllMethod } from '../../../startup/both/Methods';
import scrollableY from '../../helpers/CommonProps';

const bridge = new SimpleSchema2Bridge(new SimpleSchema({
  elements: {
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
    setNumElements(parseInt(event.target.value, 10));
  };
  return (
    <Container className="p-2 text-center" id="admin-page">
      <Tabs>
        <Tab eventKey="admin-profile" title="Profile"><Profile /></Tab>
        <Tab eventKey="dataDb" title="Server Data">
          <Card>
            <Col>
              <AutoForm schema={bridge}>
                <InputGroup className="align-items-center" onChange={e => handleChange(e)}>
                  <Button onClick={handleClearDataButton} className="me-2">Reset all data to default</Button>
                  <InputGroup.Text>Items per Page: </InputGroup.Text>
                  <SelectField
                    type="number"
                    name="elements"
                    label={null}
                    className="mb-auto"
                    inputClassName="rounded-0 rounded-end"
                  />
                </InputGroup>
              </AutoForm>
              <Tabs>
                {collectionNames.map(collectionName => (
                  <Tab
                    key={collectionName}
                    style={scrollableY}
                    title={collectionName.replace('Collection', '')}
                    eventKey={collectionName}
                  >
                    <AdminDataList
                      collectionName={collectionName}
                      numElements={numElements}
                    />
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
