import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Dropdown, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from './LoadingSpinner';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const SearchRecipeBar = () => {
  const { ready, ingredients, recipes } = useTracker(() => {
    // Searching by recipe or by ingredients requires access to both data documents, and the relational document
    const subIngredients = Meteor.subscribe(Ingredients.userPublicationName);
    const subRecipes = Meteor.subscribe(Ingredients.userPublicationName);

    // Determine if the subscription is ready
    const rdy = subIngredients.ready() && subRecipes.ready();

    // Get and return all (Search field) documents
    const ingredientItems = Ingredients.collection.find({}).fetch();
    const recipeItems = Recipes.collection.find({}).fetch();
    return {
      ingredients: ingredientItems,
      recipes: recipeItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Card>
      <Card.Body>
        <Row>
          <Col>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Search By
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Name</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Ingredient</Dropdown.Item>
                <Dropdown.Item href="#/action-3">email</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ) : <LoadingSpinner />);
};

export default SearchRecipeBar;
