import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Profiles } from '../../api/profiles/Profiles';
import LoadingSpinner from './LoadingSpinner';

const ProfileAdmin = ({ profile }) => (
  <tr>
    <td className="text-start">{profile._id}</td>
    <td>{profile.email}</td>
    <td>{(profile.vegan) ? 'True' : 'False'}</td>
    <td>{(profile.glutenFree) ? 'True' : 'False'}</td>
  </tr>
);

// Require a document to be passed to this component.
ProfileAdmin.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    vegan: PropTypes.bool,
    glutenFree: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
};

/* Admin and vendor page. */
const ProfilesListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, profiles } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const profilesItems = Profiles.collection.find({}).fetch();
    return {
      profiles: profilesItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
      <h5>Profiles Collection</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>id</th>
            <th>email (*)</th>
            <th>vegan</th>
            <th>glutenFree</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => <ProfileAdmin key={profile._id} profile={profile} />)}
        </tbody>
      </Table>
    </Container>
  ) : <LoadingSpinner />);
};

export default ProfilesListAdmin;
