import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Clock, PersonFill } from 'react-bootstrap-icons';

/** Renders a single row in the List Recipe table. See pages/ListRecipe.jsx. */
const RecipeInfo = ({ recipe }) => (
  <Card style={{ width: '18rem' }} className="h-auto m-auto">
    <Card.Img variant="top" src={recipe.image} />
    <Card.Title className="px-3">{recipe.name}</Card.Title>
    <Card.Subtitle className="px-3">{recipe.owner}</Card.Subtitle>
    <Card.Body>
      <Card.Text className="mb-auto"><Clock /> {recipe.time}</Card.Text>
      <Card.Text className="mb-auto"><PersonFill /> {recipe.servings} Servings</Card.Text>
    </Card.Body>
    <Card.Footer>Source: <Card.Link href={recipe.source}>{recipe.source}</Card.Link></Card.Footer>
  </Card>
);

// Require a document to be passed to this component.
RecipeInfo.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    source: PropTypes.string,
    image: PropTypes.string,
    time: PropTypes.string,
    servings: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default RecipeInfo;
