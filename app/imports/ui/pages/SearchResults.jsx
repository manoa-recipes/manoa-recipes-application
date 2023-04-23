import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Container, Card } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/search/SearchBar';

const SearchResults = () => {
  const { terms } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients, recipes, recipeIngredients } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const sub3 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    return {
      ready: rdy,
      ingredients: Ingredients.collection.find({}).fetch(),
      recipes: Recipes.collection.find({}).fetch(),
      recipeIngredients: RecipesIngredients.collection.find({}).fetch(),
    };
  }, [terms]);
  console.log(`SearchResults: /search/${terms}\n  ready: ${ready}`);
  return (ready ? (
    <Container fluid>
      <Card>
        <Card.Header><SearchBar /></Card.Header>
      </Card>
    </Container>
  ) : <LoadingSpinner />);
};

export default SearchResults;
