import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Container, Table } from 'react-bootstrap';
import { Recipes } from '../../api/recipes/Recipes';
import { Profiles } from '../../api/profiles/Profiles';
import LoadingSpinner from './LoadingSpinner';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import { Vendors } from '../../api/vendors/Vendors';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const IndividualRecipe = ({  }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Recipes.userPublicationName);
    const sub2 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const sub3 = Meteor.subscribe(Vendors.userPublicationName);
    const sub4 = Meteor.subscribe(VendorsIngredients.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>Profiles Collection</h5>
    </Container>
  ) : <LoadingSpinner />);
};

export default IndividualRecipe;
