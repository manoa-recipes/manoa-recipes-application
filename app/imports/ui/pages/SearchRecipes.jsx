import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchRecipes = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipes, ingredients, recipeIngredients } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const sub3 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    return {
      ready: rdy,
      recipes: Recipes.collection.find({}).fetch(),
      ingredients: Ingredients.collection.find({}).fetch(),
      recipeIngredients: RecipesIngredients.collection.find({}).fetch(),
    };
  }, []);
  let toggleText = 'Ingredient';
  const itemClicked = (ref) => {
    console.log(toggleText);
    toggleText = ref;
    console.log(toggleText);
  };

  // Component that displays the whole page: search bar as a form and results as a card group or list group
  return (ready ? (
    <Container>
      <Row className="align-items-center">
        <Col>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-search-by-field">
              Dropdown Text
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {ingredients.map(ingredient => <Dropdown.Item eventKey={ingredient._id} onClick={itemClicked(ingredient.name)}>{ingredient.name}</Dropdown.Item>)}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default SearchRecipes;
