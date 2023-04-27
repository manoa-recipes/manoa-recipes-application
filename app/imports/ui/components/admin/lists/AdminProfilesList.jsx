import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Table, Card, Accordion } from 'react-bootstrap';
import { Profiles } from '../../../api/profiles/Profiles';
import LoadingSpinner from '../LoadingSpinner';

// Components to display Profiles documents
const AdminProfileItem = ({ profile }) => {
  const remProfile = ({ _id }) => {

  };
  return (
    <tr>
      <td className="text-start">{profile._id}</td>
      <td>{profile.email}</td>
      <td>{(profile.vegan) ? 'True' : 'False'}</td>
      <td>{(profile.glutenFree) ? 'True' : 'False'}</td>
    </tr>
  );
};
AdminProfileItem.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    vegan: PropTypes.bool,
    glutenFree: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
};
const AdminProfilesList = () => {
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
    <Card.Body>
      <Accordion>
        <Accordion.Header id="admin-profiles"><h5>Profiles</h5></Accordion.Header>
        <Accordion.Body>
          <Table striped bordered variant="light">
            <thead>
              <tr>
                <th>id</th>
                <th>email (*)</th>
                <th>vegan</th>
                <th>glutenFree</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => <AdminProfileItem key={profile._id} profile={profile} />)}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion>
    </Card.Body>
  ) : <LoadingSpinner />);
};

export default AdminProfilesList;
