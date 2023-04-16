import React, { useState } from 'react';
import swal from 'sweetalert';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-bootstrap5';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Recipes } from '../../api/recipes/Recipes';
import LoadingSpinner from '../components/LoadingSpinner';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { updateRecipeMethod } from '../../startup/both/Methods';

const verbose = true;
const recipeBridge = new SimpleSchema2Bridge(Recipes.schema);

const IngredientListItem = ({ ingredient, index }) => (
  <Container>
    <Row className="align-items-center">
      <Col xs={2}>{index})</Col>
      <Col xs={10}>
        <Row>
          <Col>{ingredient.quantity}</Col>
          <Col>{ingredient.size}</Col>
          <Col>{ingredient.ingredient}</Col>
        </Row>
      </Col>
    </Row>
  </Container>
);
IngredientListItem.propTypes = {
  ingredient: PropTypes.shape({
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const IngredientList = ({ ingredients }) => (
  <Card>
    <Card.Header>Ingredients</Card.Header>
    <Card.Body>
      {ingredients.map((ingredient, index) => (<IngredientListItem ingredient={ingredient} index={index + 1} />))}
    </Card.Body>
  </Card>
);
IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf({
    ingredient: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
  }).isRequired,
};

/* Renders the EditStuff page for editing a single document. */
const EditRecipe = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  if (verbose) { console.log('EditRecipe _id: ', _id); }
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { recipe, ready, ingredientDocs } = useTracker(() => {
    // Get access to all collections.
    const sub1 = Meteor.subscribe(Recipes.userPublicationName);
    const sub2 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const sub3 = Meteor.subscribe(Ingredients.userPublicationName);
    // Determine if the subscriptions are ready
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    // Get the document
    const document = Recipes.collection.findOne(_id);
    if (verbose) {
      console.log('Recipes: ', Recipes.collection.find({}).fetch());
      console.log('Document: ', document, 'Ready: ', rdy);
    }

    const ingredientItems = RecipesIngredients.collection.find({ recipe: document.name }).fetch();
    if (verbose) { console.log('Ingredient Documents: ', ingredientItems, '\nReady: ', rdy); }
    return {
      recipe: document,
      ingredientDocs: ingredientItems,
      ready: rdy,
    };
  }, [_id]);
  const [ingredients, setIngredients] = useState(ingredientDocs);
  if (verbose) { console.log('ingredients: ', ingredients, '\nReady: ', ready); }
  // On successful submit, insert the data.
  const submit = (data) => {
    const { name, owner, image, instructions, time, servings } = data;
    Meteor.call(updateRecipeMethod, { name, owner, image, instructions, time, servings, ingredients }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe updated successfully', 'success');
      }
    });
  };

  const onClick = () => {

  };

  return ready ? (
    <Container className="p-2 text-end">
      <AutoForm schema={recipeBridge} onSubmit={data => submit(data)}>
        <Card className="text-center">
          <Card.Header><Card.Title><h2>Edit Recipe</h2></Card.Title></Card.Header>
          <Card.Header>
            <Col>
              <Row><TextField name="name" placeholder={recipe.name} value={recipe.name} /></Row>
              <Row><TextField name="image" placeholder={recipe.image} value={recipe.image} /></Row>
              <Row>
                <Col><TextField name="time" decimal={null} placeholder={recipe.time} value={recipe.time} /></Col>
                <Col><NumField name="servings" decimal={null} placeholder={recipe.servings} value={recipe.servings} /></Col>
              </Row>
            </Col>
          </Card.Header>
          <Card.Body>
            <IngredientList ingredients={ingredients} />
            <Button onClick={onClick}>Edit Ingredients</Button>
          </Card.Body>
          <Card.Body>
            <Col>
              <LongTextField name="instructions" />
            </Col>
          </Card.Body>
          <Card.Body className="text-end">
            <SubmitField value="Submit" />
            <ErrorsField />
          </Card.Body>
        </Card>
      </AutoForm>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditRecipe;
