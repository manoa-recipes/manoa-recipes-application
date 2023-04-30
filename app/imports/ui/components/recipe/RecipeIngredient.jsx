import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { Accordion, Card } from 'react-bootstrap';
import { Profiles } from '../../../api/profiles/Profiles';
import LoadingSpinner from '../LoadingSpinner';
import { VendorsIngredients } from '../../../api/vendors/VendorsIngredients';
import RecipeVendorIngredient from './RecipeVendorIngredient';

// A component to display an ingredient in a recipe, and distinguish when allergic
const RecipeIngredient = ({ recipeIngredient }) => {
  const { size, ingredient } = recipeIngredient;
  const quantity = (size > 1) ? `${recipeIngredient.quantity}` : '';
  const text = `${quantity} ${size} ${ingredient}`;
  // Subscribe to the database before rendering
  const { ready, user, vendorIngredients } = useTracker(() => {
    // Get the email of the current user
    const sub = Meteor.subscribe(Profiles.userPublicationName);
    const sub2 = Meteor.subscribe(VendorsIngredients.userPublicationName);
    const rdy = sub.ready() && sub2.ready();
    // Retrieve all vendor documents relating to this ingredient
    const vendorIngredientItems = VendorsIngredients.collection.find({ ingredient }).fetch();
    return {
      // (bool) allergies array includes() the current ingredient
      user: Profiles.collection.findOne({ email: Meteor.user()?.username }),
      vendorIngredients: vendorIngredientItems,
      ready: rdy,
    };
  }, []);
  if (!ready) { return (<LoadingSpinner />); }
  // Select an appropriate variant for the allergy warning
  const className = user.allergies.includes(ingredient) ? 'bg-danger text-white' : 'bg-light text-dark';
  // Display the component for the ingredient
  return (vendorIngredients.length > 0) ? (
    <Card.Body className={className}>
      <Accordion>
        <Accordion.Header>{text}</Accordion.Header>
        <Accordion.Body>
          {vendorIngredients.map(document => (
            <RecipeVendorIngredient key={document._id} document={document} />
          ))}
        </Accordion.Body>
      </Accordion>
    </Card.Body>
  ) : (
    <Card.Body className={className}><Card.Text>{text}</Card.Text></Card.Body>
  );
};

// Require a document to be passed to this component.
RecipeIngredient.propTypes = {
  recipeIngredient: PropTypes.shape({
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};
export default RecipeIngredient;
