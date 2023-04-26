import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Table, Card, Accordion, Button, Row, Col, Modal } from 'react-bootstrap';
import { AutoFields, AutoForm, SubmitField } from 'uniforms-bootstrap5';
import LoadingSpinner from '../../LoadingSpinner';
import { removeDocMethod } from '../../../../startup/both/Methods';
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
  const bridge = new SimpleSchema2Bridge(Ingredients.schema);
  const editDocFunc = (event) => {
    console.log('editDocFunc: ', event);
    setShow(true);
  };
  const editDocSubmit = (data) => {
    console.log('editDocSubmit: ', data);
  };
  const cancelEdit = () => setShow(false);
  const removeDocFunc = (event) => {
    console.log('Removing Ingredient: ', event, '\n  _id: ', event.target.value, '\n  Collection: ', collection.name);
    Meteor.call(removeDocMethod, { _id: event.target.value, collectionName: collection.name }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Ingredient removed successfully', 'success');
      }
    });
  };
  /** There HAS to be a better way to pass the _id.  This works for now. */
  return (
    <tr>
      <td className="text-start">
        <Button
          id="edit"
          value={document._id}
          onClick={(e) => editDocFunc(e)}
        >
          {document._id}
        </Button>
      </td>
      <td>{document.name}</td>
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
      <Modal show={show} onHide={(e) => console.log(e)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <AutoForm
          schema={bridge}
          model={document}
          onSubmit={(data) => editDocSubmit(data)}
        >
          <Modal.Body><AutoFields className="mb-auto" /></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelEdit}>
              Close
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
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients } = useTracker(() => {
    const subscription = Meteor.subscribe(Ingredients.userPublicationName);
    // Data is ready
    const rdy = subscription.ready();
    return {
      ingredients: Ingredients.collection.find({}).fetch(),
      ready: rdy,
    };
  }, []);
  console.log(ingredients, Ingredients, `keys: ${Ingredients.schema._schemaKeys}`, 'schema: ', Ingredients.schema._schema);
  return (ready ? (
    <Card.Body>
      <Accordion>
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
              <Table striped bordered variant="light">
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
                  {ingredients.map((ingredient) => <AdminIngredientItem key={ingredient._id} document={ingredient} collectionName={collectionName} />)}
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
