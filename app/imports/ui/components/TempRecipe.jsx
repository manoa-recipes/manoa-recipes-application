import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const Recipe = ({ recipe }) => (
  <Card>
    <Card.Title>{recipe.name}</Card.Title>
    <Card.Subtitle>{recipe.owner}</Card.Subtitle>
    <Card.Body>
      <Card.Text>Estimated time: {recipe.time} minutes.</Card.Text>
      <Card.Text>{recipe.instructions}</Card.Text>
    </Card.Body>
    <Card.Footer>
      <Card.Text>Serves {recipe.servings}</Card.Text>
    </Card.Footer>
  </Card>
);

// Require a document to be passed to this component.
Recipe.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    instructions: PropTypes.string,
    time: PropTypes.number,
    servings: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default Recipe;
