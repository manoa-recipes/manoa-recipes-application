import React from 'react';
import PropTypes from 'prop-types';
import { CardGroup, Col } from 'react-bootstrap';
import RecipeIngredient from './RecipeIngredient';

// Displays and organizes the entire ingredient list for an individual recipe
/** This component takes all relevant data documents from a higher level component
 *   recipeIngredients all relate to THIS recipe, there should always at least be one
 *   vendorIngredients all relate to the ingredients of THIS recipe, if they exist */
const RecipeIngredientList = ({ recipeIngredients }) => (
  <CardGroup>
    <Col>
      {recipeIngredients.map(recipeIngredient => <RecipeIngredient recipeIngredient={recipeIngredient} />)}
    </Col>
  </CardGroup>
);
RecipeIngredientList.propTypes = {
  recipeIngredients: PropTypes.arrayOf({
    recipe: PropTypes.string,
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    // _id: PropTypes.string,
  }).isRequired,
};

export default RecipeIngredientList;
