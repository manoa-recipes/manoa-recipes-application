import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Button, Modal } from 'react-bootstrap';
import { AutoFields, AutoForm, SubmitField } from 'uniforms-bootstrap5';
import { updateDocMethod, removeDocMethod } from '../../../../startup/both/Methods';
import { Ingredients } from '../../../../api/ingredients/Ingredients';
import { Recipes } from '../../../../api/recipes/Recipes';
import { RecipesIngredients } from '../../../../api/recipes/RecipesIngredients';
import { Vendors } from '../../../../api/vendors/Vendors';
import { VendorsIngredients } from '../../../../api/vendors/VendorsIngredients';
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

// Components to display any document
const AdminDataListItem = ({ document, collectionName }) => {
  const [show, setShow] = useState(false);
  const collection = getCollection(collectionName);
  const bridge = new SimpleSchema2Bridge(collection.schema);
  const editOpen = () => setShow(true);
  const editClose = () => setShow(false);
  const editSubmit = (data) => {
    // Attach the _id of the current item to the temporary data document from the form (so the server function knows which one to alter)
    Meteor.call(updateDocMethod, { collectionName, document: _.extend({}, data, { _id: document._id }) }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Ingredient removed successfully', 'success');
        setShow(false);
      }
    });
  };
  const removeDocFunc = () => {
    Meteor.call(removeDocMethod, { _id: document._id, collectionName }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Ingredient removed successfully', 'success');
      }
    });
  };
  if (collectionName === Profiles.name) { console.log(document); }
  /** Maps through the keys of the schema and extracts the data from the document.
    * Then adds an edit button and the modal holding the form for editing the doc. */
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
      {collection.schema._schemaKeys.map((field, index) => (
        <td
          className="w-auto h-auto m-auto"
          style={{ maxWidth: '10rem' }}
          key={index}
        >
          <div style={{ maxHeight: '10vh', overflowY: 'auto' }}>{document[field]}</div>
        </td>
      ))}
      <td>
        <Button
          id="remove"
          value={document._id}
          variant="danger"
          onClick={removeDocFunc}
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
AdminDataListItem.propTypes = {
  document: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  collectionName: PropTypes.string.isRequired,
};
export default AdminDataListItem;
