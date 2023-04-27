import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card } from 'react-bootstrap';
import RecipeIngredient from './RecipeIngredient';

/** Renders the list of ingredients for a recipe. */
const RecipeIngredientList = ({ recipeIngredients }) => (
  <Card
    style={{ width: '18rem' }}
    className="h-auto m-auto g-0 gap-0"
  >
    <Accordion defaultActiveKey="0" alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header className="h-auto p-0 m-0 g-0 text-center flex-row bg-black">Ingredients:</Accordion.Header>
        <Accordion.Body
          style={{ maxHeight: '50vh', overflowY: 'auto' }}
        >
          {recipeIngredients.map((recipeIngredient, index) => (
            <RecipeIngredient key={recipeIngredient._id} recipeIngredient={recipeIngredient} index={index} />
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Card>
);
// Require a document to be passed to this component.
RecipeIngredientList.propTypes = {
  recipeIngredients: PropTypes.arrayOf({
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
export default RecipeIngredientList;
