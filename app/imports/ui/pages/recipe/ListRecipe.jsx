import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../../components/LoadingSpinner';
import RecipeCard from '../../components/recipe/RecipeCard';
import { Recipes } from '../../../api/recipes/Recipes';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const UserHome = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const [restriction, setRestriction] = useState({ glutenFree: false, vegan: false });
  const { ready, recipes } = useTracker(() => {
  // Note that this subscription will get cleaned up
  // when your component is unmounted or deps change.
  // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Recipes.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const recipesItems = Recipes.collection.find({}).fetch();
    return {
      recipes: recipesItems,
      ready: rdy,
    };
  }, []);

  const handleFilterClick = (filter) => {
    setRestriction({ ...restriction, [filter]: !restriction[filter] });
  };

  const filteredRecipes = recipes.filter((recipe) => (
    (!restriction.glutenFree || recipe.glutenFree) &&
      (!restriction.vegan || recipe.vegan)
  ));
  return (ready ? (
    <Container className="py-3" id="list-recipe-page">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>All Recipes</h2>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button className="p-1 px-2 mx-5" variant={restriction.vegan ? 'success' : 'btn btn-secondary'} onClick={() => handleFilterClick('vegan')}>Vegan</Button>

            <Button className="p-1 px-2 mx-5" variant={restriction.glutenFree ? 'success' : 'btn btn-secondary'} onClick={() => handleFilterClick('glutenFree')}>Gluten Free</Button>

            <Button className="p-1 px-2 mx-5" variant={(!restriction.glutenFree && !restriction.vegan) ? 'success' : 'btn btn-secondary'} onClick={() => setRestriction({ glutenFree: false, vegan: false })}>All Recipes</Button>

          </Col>
          <Row xs={1} md={2} lg={3} className="g-4 mt-1">
            {filteredRecipes.map((recipe) => (<Col key={recipe._id}><RecipeCard recipe={recipe} /></Col>))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default UserHome;
