import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';
import RecipeCard from '../components/RecipeCard';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const UserHome = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Stuffs.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const stuffItems = Stuffs.collection.find({}).fetch();
    return {
      stuffs: stuffItems,
      ready: rdy,
    };
  }, []);

  const recipes = [{
    name: 'Lettuce and Tomato Salad', description: 'The classic salad',
    image: 'https://lh3.googleusercontent.com/4eyzo2D9zdI8iyIRHGC_Ehe4rzW7j3DIxZWctid6rx65yfsnvr31mIt2BEQeVqQy2Zork9Ysy-QTO4i6oOL6uQ=w1280-h1280-c-rj-v1-e365',
    instructions: 'Wash the lettuce and tomato, chop the lettuce and tomato, eat',
    time: '10 minutes',
  },
  ];
  return (ready ? (
    <div className="userHomeBackground">
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col>
            <Col className="text-center">
              <h2>Featured Recipe</h2>
            </Col>
            <Row xs={1} md={2} lg={3} className="g-4">
              {recipes.map((recipe, index) => (<Col key={index}><RecipeCard recipe={recipe} /></Col>))}
            </Row>

          </Col>
        </Row>
      </Container>
    </div>
  ) : <LoadingSpinner />);
};

export default UserHome;
