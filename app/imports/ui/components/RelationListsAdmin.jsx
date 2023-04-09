import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Row, Container, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import LoadingSpinner from './LoadingSpinner';

// Components to display RecipesIngredients documents
const RecipeIngredientAdmin = ({ recipeIngredient }) => (
  <tr>
    <td className="text-start">{recipeIngredient._id}</td>
    <td>{recipeIngredient.recipe}</td>
    <td>{recipeIngredient.ingredient}</td>
    <td>{recipeIngredient.size}</td>
    <td>{recipeIngredient.quantity}</td>
  </tr>
);
RecipeIngredientAdmin.propTypes = {
  recipeIngredient: PropTypes.shape({
    recipe: PropTypes.string,
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
const RecipesIngredientsListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipesIngredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(RecipesIngredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const recipesIngredientsItems = RecipesIngredients.collection.find({}).fetch();
    return {
      recipesIngredients: recipesIngredientsItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>RecipesIngredients Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>Recipe</th>
            <th>Ingredient</th>
            <th>Size</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {recipesIngredients.map((recipeIngredient) => <RecipeIngredientAdmin key={recipeIngredient._id} recipeIngredient={recipeIngredient} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

// Components to display VendorsIngredients documents
const VendorIngredientAdmin = ({ vendorIngredient }) => (
  <tr>
    <td className="text-start">{vendorIngredient._id}</td>
    <td>{vendorIngredient.address}</td>
    <td>{vendorIngredient.ingredient}</td>
    <td>{vendorIngredient.inStock ? 'True' : 'False'}</td>
    <td>{vendorIngredient.size}</td>
    <td>{vendorIngredient.price}</td>
  </tr>
);
VendorIngredientAdmin.propTypes = {
  vendorIngredient: PropTypes.shape({
    address: PropTypes.string,
    ingredient: PropTypes.string,
    inStock: PropTypes.bool,
    size: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
const VendorsIngredientsListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, vendorsIngredients } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(VendorsIngredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const vendorsIngredientsItems = VendorsIngredients.collection.find({}).fetch();
    return {
      vendorsIngredients: vendorsIngredientsItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>VendorsIngredients Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>address</th>
            <th>ingredient</th>
            <th>inStock</th>
            <th>size</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {vendorsIngredients.map((vendorIngredient) => <VendorIngredientAdmin key={vendorIngredient._id} vendorIngredient={vendorIngredient} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

/* Display all relation data: */
const RelationListsAdmin = () => (
  <Col>
    <Row><RecipesIngredientsListAdmin /></Row>
    <Row><VendorsIngredientsListAdmin /></Row>
  </Col>
);

export default RelationListsAdmin;
