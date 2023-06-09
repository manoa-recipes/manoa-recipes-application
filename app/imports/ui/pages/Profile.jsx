import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Card, ListGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { Profiles } from '../../api/profiles/Profiles';

/* Renders the user's profile as Card components. */
const UserProfile = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, profileData } = useTracker(() => {
    // Get access to Profile documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);

    // Determine if the subscription is ready
    const rdy = subscription.ready();

    // Get the profile document
    // ***note: to access any data from the document, use profileItems.key
    const user = (Meteor.userId() !== null) ? Meteor.user()?.username : 'tempUser';
    const profileItems = Profiles.collection.findOne({ email: user });
    return {
      profileData: profileItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3" id="profile-page">
      <Row className="d-flex justify-content-center">
        <Col className="col-3 text-center border-gradient off-white-background rounded-2 py-4" id="my-profile">
          <Container className="py-4">
            <Image className="profile-img rounded-circle border border-white border-2" src="https://www.winsornewton.com/na/wp-content/uploads/sites/50/2019/09/50903849-WN-ARTISTS-OIL-COLOUR-SWATCH-WINSOR-EMERALD-960x960.jpg" />
          </Container>
          <h1>My Profile</h1>
          <h5>{ Meteor.user().username }</h5>
        </Col>
        <Col md={7} className="col-4 rounded-2">
          <Container>
            <Card id="user-information-card">
              <Card.Header className="py-2 d-flex align-content-center">
                <Card.Title>
                  User Information
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup as="ol" variant="flush">
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Allergies:</div>
                    </div>
                    { (!Array.isArray(profileData.allergies) || !profileData.allergies.length) ? 'None' : profileData.allergies.join(', ')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Vegan:</div>
                    </div>
                    { profileData.vegan ? 'Yes' : 'No' }
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Gluten free:</div>
                    </div>
                    { profileData.glutenFree ? 'Yes' : 'No' }
                  </ListGroup.Item>

                </ListGroup>
                <Link to={`/edit_user_profile/${profileData._id}`}>Edit</Link>

              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default UserProfile;
