import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';
import { Clock } from 'react-bootstrap-icons';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const RecipeCard = ({ recipe }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={recipe.image} />
    </Card.Header>
    <Card.Title className="px-3">{recipe.name}</Card.Title>
    <Card.Subtitle className="px-3">{recipe.owner}</Card.Subtitle>
    <Card.Body>
      <Card.Text>{recipe.instructions}</Card.Text>
      <Card.Text><Clock /> {recipe.time}</Card.Text>
    </Card.Body>
  </Card>

);

// Require a document to be passed to this component.
RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    image: PropTypes.string,
    instructions: PropTypes.string,
    time: PropTypes.string,
    servings: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default RecipeCard;
