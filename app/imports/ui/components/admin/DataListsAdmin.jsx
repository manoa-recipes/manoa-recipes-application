import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Table, Card, Accordion } from 'react-bootstrap';
import { Profiles } from '../../../api/profiles/Profiles';
import { Vendors } from '../../../api/vendors/Vendors';
import { Recipes } from '../../../api/recipes/Recipes';
import LoadingSpinner from '../LoadingSpinner';
import AdminIngredientsList from './lists/AdminIngredientsList';

// Components to display Profiles documents
const ProfileAdmin = ({ profile }) => (
  <tr>
    <td className="text-start">{profile._id}</td>
    <td>{profile.email}</td>
    <td>{(profile.vegan) ? 'True' : 'False'}</td>
    <td>{(profile.glutenFree) ? 'True' : 'False'}</td>
  </tr>
);
ProfileAdmin.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    vegan: PropTypes.bool,
    glutenFree: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
};
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
              {profiles.map((profile) => <ProfileAdmin key={profile._id} profile={profile} />)}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion>
    </Card.Body>
  ) : <LoadingSpinner />);
};

// Components to display Vendors documents
const VendorAdmin = ({ vendor }) => (
  <tr>
    <td className="text-start">{vendor._id}</td>
    <td>{vendor.name}</td>
    <td>{vendor.address}</td>
  </tr>
);
VendorAdmin.propTypes = {
  vendor: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};
const VendorsListAdmin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, vendors } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Vendors.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const vendorsItems = Vendors.collection.find({}).fetch();
    return {
      vendors: vendorsItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Card.Body>
      <Accordion>
        <Accordion.Header id="admin-vendors-collection"><h5>Vendors Collection</h5></Accordion.Header>
        <Accordion.Body>
          <Table striped bordered variant="light">
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>address (*)</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => <VendorAdmin key={vendor._id} vendor={vendor} />)}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion>
    </Card.Body>
  ) : <LoadingSpinner />);
};

// Components to display Recipes documents
const RecipeAdmin = ({ recipe }) => (
  <tr>
    <td className="text-start">{recipe._id}</td>
    <td>{recipe.name}</td>
    <td>{recipe.owner}</td>
    <td>{recipe.instructions}</td>
    <td>{recipe.time}</td>
    <td>{recipe.servings}</td>
  </tr>
);
RecipeAdmin.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    instructions: PropTypes.string,
    time: PropTypes.string,
    servings: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
const RecipesListAdmin = () => {
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
    <Card.Body>
      <Accordion>
        <Accordion.Header id="recipes-collection"><h5>Recipes Collection</h5></Accordion.Header>
        <Accordion.Body>
          <Table striped bordered variant="light">
            <thead>
              <tr>
                <th>id</th>
                <th>name (*)</th>
                <th>owner</th>
                <th>instructions</th>
                <th>time</th>
                <th>servings</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => <RecipeAdmin key={recipe._id} recipe={recipe} />)}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion>
    </Card.Body>
  ) : <LoadingSpinner />);
};

/* Organize all admin data */
const DataListsAdmin = () => (
  <Card bg="light">
    <AdminIngredientsList />
    <ProfilesListAdmin />
    <VendorsListAdmin />
    <RecipesListAdmin />
  </Card>
);

export default DataListsAdmin;
