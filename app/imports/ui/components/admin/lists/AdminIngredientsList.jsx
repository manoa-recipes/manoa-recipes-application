import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Table, Card, Accordion, Button, Row, Col, Modal } from 'react-bootstrap';
import { AutoFields, AutoForm, SubmitField } from 'uniforms-bootstrap5';
import LoadingSpinner from '../../LoadingSpinner';
import { updateDocMethod, removeDocMethod } from '../../../../startup/both/Methods';
import { Ingredients } from '../../../../api/ingredients/Ingredients';
import { Recipes } from '../../../../api/recipes/Recipes';
import { RecipesIngredients } from '../../../../api/recipes/RecipesIngredients';
import { Vendors } from '../../../../api/vendors/Vendors';
import { VendorsIngredients } from '../../../../api/vendors/VendorsIngredients';

// Function to select the correct collection
const getCollection = (collectionName) => {
  switch (collectionName) {
  case Recipes.name: return Recipes;
  case Ingredients.name: return Ingredients;
  case RecipesIngredients.name: return RecipesIngredients;
  case Vendors.name: return Vendors;
  case VendorsIngredients.name: return VendorsIngredients;
  default: return undefined;
  }
};

// Components to display Ingredients documents
const AdminIngredientItem = ({ document, collectionName }) => {
  const [show, setShow] = useState(false);
  const collection = getCollection(collectionName);
  const bridge = new SimpleSchema2Bridge(collection.schema);
  const keys = collection.schema._schemaKeys;
  const editOpen = () => setShow(true);
  const editClose = () => setShow(false);
  const editSubmit = (data) => {
    console.log('editDocSubmit: ', data);
    // Attach the _id of the current item to the data document from the form
    Meteor.call(updateDocMethod, { collectionName, document: _.extend({}, data, { _id: document._id }) }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Ingredient removed successfully', 'success');
        setShow(false);
      }
    });
  };
  const removeDocFunc = (event) => {
    Meteor.call(removeDocMethod, { _id: event.target.value, collectionName: collection.name }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Ingredient removed successfully', 'success');
      }
    });
  };
  return (
    <tr>
      <td className="text-start">
        <Button
          id="edit"
          value={document._id}
          onClick={(e) => editOpen(e)}
        >
          {document._id}
        </Button>
      </td>
      {keys.map((key, index) => (<td key={index}>{document[key]}</td>))}
      <td>
        <Button
          id="remove"
          value={document._id}
          variant="danger"
          onClick={(e) => removeDocFunc(e)}
        >
          -
        </Button>
      </td>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <AutoForm
          schema={bridge}
          model={document}
          onSubmit={(data) => editSubmit(data)}
        >
          <Modal.Body><AutoFields className="mb-auto" /></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={editClose}>
              Cancel
            </Button>
            <SubmitField value="Save Changes" />
          </Modal.Footer>
        </AutoForm>
      </Modal>
    </tr>
  );
};
AdminIngredientItem.propTypes = {
  document: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  collectionName: PropTypes.string.isRequired,
};
const AdminIngredientsList = ({ collectionName }) => {
  const collection = getCollection(collectionName);
  const keys = collection.schema._schemaKeys;
  const schema = collection.schema._schema;
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, documents } = useTracker(() => {
    const subscription = Meteor.subscribe(collection.userPublicationName);
    // Data is ready
    const rdy = subscription.ready();
    return {
      documents: collection.collection.find({}).fetch(),
      ready: rdy,
    };
  }, []);
  console.log(RecipesIngredients, 'keys: ', keys, 'schema: ', schema[keys[0]]);
  return (ready ? (
    <Card.Body>
      <Accordion alwaysOpen>
        <Accordion.Header id="admin-ingredients">
          <h5 className="text-center">Ingredients</h5>
        </Accordion.Header>
        <Accordion.Body>
          <Col>
            <Row>
              <Col><Button>Clear Data</Button></Col>
              <Col><Button>Fill Data</Button></Col>
            </Row>
            <Row>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>_id (Edit)</th>
                    {Ingredients.schema._schemaKeys.map((field, index) => (
                      <th key={index}>{field}</th>
                    ))}
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(document => <AdminIngredientItem key={document._id} document={document} collectionName={collectionName} />)}
                </tbody>
              </Table>
            </Row>
          </Col>
        </Accordion.Body>
      </Accordion>
    </Card.Body>
  ) : <LoadingSpinner />);
};
AdminIngredientsList.propTypes = {
  collectionName: PropTypes.string.isRequired,
};
export default AdminIngredientsList;
