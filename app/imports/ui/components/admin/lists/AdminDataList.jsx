import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Table, Card, Accordion, Button, Row, Col, Modal } from 'react-bootstrap';
import { Star } from 'react-bootstrap-icons';
import { AutoFields, AutoForm, SubmitField } from 'uniforms-bootstrap5';
import LoadingSpinner from '../../LoadingSpinner';
import { updateDocMethod, removeDocMethod } from '../../../../startup/both/Methods';
import { Ingredients } from '../../../../api/ingredients/Ingredients';
import { Recipes } from '../../../../api/recipes/Recipes';
import { RecipesIngredients } from '../../../../api/recipes/RecipesIngredients';
import { Vendors } from '../../../../api/vendors/Vendors';
import { VendorsIngredients } from '../../../../api/vendors/VendorsIngredients';
import AdminDataListItem from './AdminDataListItem';
import { Profiles } from '../../../../api/profiles/Profiles';

// Function to select the correct collection
const getCollection = (collectionName) => {
  switch (collectionName) {
  case Recipes.name: return Recipes;
  case Ingredients.name: return Ingredients;
  case RecipesIngredients.name: return RecipesIngredients;
  case Vendors.name: return Vendors;
  case VendorsIngredients.name: return VendorsIngredients;
  case Profiles.name: return Profiles;
  default: return undefined;
  }
};

const AdminDataList = ({ collectionName }) => {
  const collection = getCollection(collectionName);
  const schema = collection?.schema._schema;
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, documents } = useTracker(() => {
    const subscription = Meteor.subscribe(collection?.userPublicationName);
    // Data is ready
    const rdy = subscription.ready();
    return {
      documents: collection?.collection.find({}).fetch(),
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Card.Body>
      <Accordion defaultActiveKey={0}>
        <Accordion.Item eventKey={0}>
          <Accordion.Header id="admin-ingredients">
            <h5 className="text-center">{collectionName}</h5>
          </Accordion.Header>
          <Accordion.Body>
            <Col>
              <Row>
                <Col><Button>Clear Data</Button></Col>
                <Col><Button>Fill Data</Button></Col>
              </Row>
              <Row>
                <Table striped bordered responsive size="sm" className="align-items-center">
                  <thead>
                    <tr>
                      <th>_id (Edit)</th>
                      {collection?.schema._schemaKeys.map((field, index) => (
                        <th key={index}>{schema[field].label} {(schema[field].index) ? (<Star />) : ''}</th>
                      ))}
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(document => <AdminDataListItem key={document._id} document={document} collectionName={collectionName} />)}
                  </tbody>
                </Table>
              </Row>
            </Col>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Card.Body>
  ) : <LoadingSpinner />);
};
AdminDataList.propTypes = {
  collectionName: PropTypes.string.isRequired,
};
export default AdminDataList;
