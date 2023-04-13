import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Card, ListGroup, Badge } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { Profiles } from '../../api/profiles/Profiles';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const UserProfile = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, profileData } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const profileItems = Profiles.collection.find({ email: Meteor.user().username }).fetch();
    return {
      profileData: profileItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Profile</h2>
          </Col>
          <Col>
            <Card>
              <Card.Header>
                { Meteor.user().username }
              </Card.Header>
              <Card.Body>
                <ListGroup as="ol" numbered>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Allergies</div>
                    </div>
                    { profileData.allergies }
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Subheading</div>
                      Cras justo odio
                    </div>
                    <Badge bg="primary" pill>
                      14
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Subheading</div>
                      Cras justo odio
                    </div>
                    <Badge bg="primary" pill>
                      14
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default UserProfile;
