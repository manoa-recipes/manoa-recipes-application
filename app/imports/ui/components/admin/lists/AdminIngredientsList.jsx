import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Table, Card, Accordion, Button } from 'react-bootstrap';
import { Ingredients } from '../../../../api/ingredients/Ingredients';
import { Profiles } from '../../../../api/profiles/Profiles';
import { Vendors } from '../../../../api/vendors/Vendors';
import { Recipes } from '../../../../api/recipes/Recipes';
import LoadingSpinner from '../../LoadingSpinner';
import { removeIngredient } from '../../../../startup/both/Methods';

// Components to display Ingredients documents
const AdminIngredientItem = ({ ingredient }) => {
  const remIngredient = (event) => {
    console.log('Removing Ingredient: ', event, '\n  Type: ', event.target.type);
    let _id;
    switch (event.target.type) {
    case 'svg': _id = event.target.parentElement.value; break;
    case 'button': _id = event.target.value; break;
    case 'path': _id = event.target.parentElement.parentElement.value; break;
    default: console.log('Warning: Unknown event Target!');
    }
    console.log(_id);
    if (_id !== undefined) {
      Meteor.call(removeIngredient, { _id }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Ingredient removed successfully', 'success');
        }
      });
    } else { console.log('Warning: _id not found.  Cancelling remove.'); }
  };
  return (
    <tr>
      <td>{ingredient._id}</td>
      <td>{ingredient.name}</td>
      <td>
        <Button
          value={ingredient._id}
          onClick={(e) => remIngredient(e)}
        >
          -
        </Button>
      </td>
    </tr>
  );
};
AdminIngredientItem.propTypes = {
  ingredient: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};
const AdminIngredientsList = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Ingredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const ingredientItems = Ingredients.collection.find({}).fetch();
    return {
      ingredients: ingredientItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Card.Body>
      <Accordion>
        <Accordion.Header id="admin-ingredients"><h5>Ingredients</h5></Accordion.Header>
        <Accordion.Body>
          <Table striped bordered variant="light">
            <thead>
              <tr>
                <th>_id</th>
                <th>Name (*)</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => <AdminIngredientItem key={ingredient._id} ingredient={ingredient} />)}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion>
    </Card.Body>
  ) : <LoadingSpinner />);
};

export default AdminIngredientsList;
