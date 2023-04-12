import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Col, Container, Row, Table } from 'react-bootstrap';
import StuffItem from '../components/StuffItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Vendors } from '../../api/vendors/Vendors';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';

// This page/component displays ALL data related to a specific recipe
const IndividualRecipe = ({ recipe }) => {
  // Deconstruct the passed object
  const { name, image, instructions, time, servings } = recipe;
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients } = useTracker(() => {
    // Access all collections (Even price information for ingredients)
    const subRecipes = Meteor.subscribe(Recipes.collection.userPublicationName);
    const subRecipeIngredients = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const subIngredients = Meteor.subscribe(Ingredients.userPublicationName);
    const subVendors = Meteor.subscribe(Vendors.userPublicationName);
    const subVendorIngredients = Meteor.subscribe(VendorsIngredients.userPublicationName);

    // Determine if the subscriptions are ready
    const rdy = subRecipes.ready() && subRecipeIngredients.ready() && subIngredients.ready() && subVendors.ready() && subVendorIngredients.ready();

    // Filter data to keep only the documents that are specific to this recipe
    const recipeItems = Recipes.collection.find({ name: name }).fetch();
    const recipeIngredientItems = RecipesIngredients.collection.find({ recipe: recipeName }).fetch();
    const ingredientItems = Ingredients.collection.find({}).fetch();
    const vendorItems
    return {
      recipeIngredients: recipeIngredientItems,
      ingredients: ingredientItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>List Stuff</h2>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Condition</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <StuffItem key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};
IndividualRecipe.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
}

export default IndividualRecipe;
