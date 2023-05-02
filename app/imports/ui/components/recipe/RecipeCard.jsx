import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Clock, PersonFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

/** Renders a single row in the List Recipe table. See pages/ListRecipe.jsx. */
const RecipeCard = ({ recipe }) => (
  <Link to={`/view-recipe/${recipe._id}`} className="recipeLink">
    <Card style={{ width: '18rem' }} className="h-100 m-auto">
      <Card.Img className="recipe-img" variant="top" src={recipe.image} style={{ height: '40vh' }} />
      <Card.Title className="px-3">{recipe.name}</Card.Title>
      <Card.Subtitle className="px-3">{recipe.owner}</Card.Subtitle>
      <Card.Body>
        <Card.Text className="mb-auto"><Clock /> {recipe.time}</Card.Text>
        <Card.Text className="mb-auto"><PersonFill /> {recipe.servings} Servings</Card.Text>
      </Card.Body>
    </Card>
  </Link>

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
