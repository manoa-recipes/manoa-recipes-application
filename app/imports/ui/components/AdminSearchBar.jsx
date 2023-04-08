import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { VendorsIngredients } from '../../api/vendors/VendorsIngredients';
import LoadingSpinner from './LoadingSpinner';

/* Admin and vendor page. */
const AdminSearchBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingrs } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subIngr = Meteor.subscribe(Ingredients.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subIngr.ready();
    // Get the Stuff documents
    const ingrItems = Ingredients.collection.find({}).fetch();
    return {
      ingrs: ingrItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="p-0">
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminSearchBar;
