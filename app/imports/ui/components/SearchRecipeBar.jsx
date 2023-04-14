import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Search } from 'react-bootstrap-icons';
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
  let searchParameter = '';
  return (ready ? (
    <Form className="d-flex" id="search-bar-nav">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {searchParameter}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="name" onClick={searchParameter = 'name'}>Name</Dropdown.Item>
          <Dropdown.Item href="ingredient">Ingredient</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Form.Control
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
      />
      <Button><Search /></Button>
    </Form>
  ) : <LoadingSpinner />);
};

export default SearchRecipeBar;
