import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import RecipeCard from '../components/RecipeCard';
import { Recipes } from '../../api/recipes/Recipes';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const UserHome = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
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

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>All Recipes</h2>
          </Col>
          <Row xs={1} md={2} lg={3} className="g-4">
            {recipes.map((recipe) => (<Col key={recipe._id}><RecipeCard recipe={recipe} /></Col>))}
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default UserHome;