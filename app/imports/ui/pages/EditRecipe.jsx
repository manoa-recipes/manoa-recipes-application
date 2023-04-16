import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import { AutoForm, ErrorsField, ListAddField, ListDelField, ListField, ListItemField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useParams } from 'react-router';
import { Recipes } from '../../api/recipes/Recipes';
import LoadingSpinner from '../components/LoadingSpinner';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { updateRecipeMethod } from '../../startup/both/Methods';

const verbose = true;
const recipeFormSchema = new SimpleSchema({
  // Recipes schema
  name: { type: String, optional: false },
  // owner: String,
  image: { type: String, optional: true, defaultValue: '' },
  instructions: { type: String, optional: false },
  time: { type: String, optional: false },
  servings: { type: Number, optional: false },
  ingredients: {
    type: Array,
    minCount: 1, // Every recipe needs at least one ingredient
  },
  // RecipesIngredients schema
  'ingredients.$': Object,
  'ingredients.$.ingredient': String,
  'ingredients.$.size': { type: String, defaultValue: 'whole' },
  'ingredients.$.quantity': { type: Number, defaultValue: 1 },
});
const recipeBridge = new SimpleSchema2Bridge(recipeFormSchema);

/** This file needs to display the ingredients list in a way that is editable */

/* Renders the EditStuff page for editing a single document. */
const EditRecipe = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  if (verbose) { console.log('EditRecipe _id: ', _id); }
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { recipe, ready, ingredients } = useTracker(() => {
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
    // Ensure document is defined before accessing the name field (Causes very bad errors if no check is done)
    const ingredientItems = document ? RecipesIngredients.collection.find({ recipe: document.name }).fetch() : [];
    if (verbose) { console.log('Ingredient Docs (useTracker): ', ingredientItems, '\nReady: ', rdy); }
    return {
      recipe: document,
      ingredients: ingredientItems,
      ready: rdy,
    };
  }, [_id]);
  if (verbose) { console.log('Ingredient Docs (Component): ', ingredients, '\nReady: ', ready); }
  const model = _.extend({}, recipe, { ingredients });
  if (verbose) { console.log('Form Model: ', model, '\nReady: ', ready); }
  const submit = (data) => {
    const { name, owner, image, instructions, time, servings, formIngredients } = data;
    Meteor.call(updateRecipeMethod, { name, owner, image, instructions, time, servings, formIngredients }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe updated successfully', 'success');
      }
    });
  };
  return ready ? (
    <Container className="p-2 text-end">
      <AutoForm model={model} schema={recipeBridge} onSubmit={data => submit(data)}>
        <Card className="text-center">
          <Card.Header><Card.Title><h2>Edit Recipe</h2></Card.Title></Card.Header>
          <Card.Header>
            <Col>
              <Row><TextField name="name" placeholder={recipe.name} defaultValue={recipe.name} /></Row>
              <Row><TextField name="image" placeholder={recipe.image} value={recipe.image} /></Row>
              <Row>
                <Col><TextField name="time" decimal={null} placeholder={recipe.time} value={recipe.time} /></Col>
                <Col><NumField name="servings" decimal={null} placeholder={recipe.servings} value={recipe.servings} /></Col>
              </Row>
            </Col>
          </Card.Header>
          <Card.Body>
            <ListField name="ingredients" className="bg-light text-dark align-items-center" formNoValidate>
              <ListItemField name="$">
                <Row className="align-items-center">
                  <Col xs={1}><ListDelField name="" removeIcon={<DashCircle color="text-dark" />} /></Col>
                  <Col xs={3} md={2}><NumField name="quantity" decimal={false} defaultValue={1} /></Col>
                  <Col xs={3} lg={2}><TextField name="size" /></Col>
                  <Col xs={5} md={6} lg={7}><TextField name="ingredient" placeholder="Type an ingredient..." /></Col>
                </Row>
              </ListItemField>
            </ListField>
            <ListAddField name="ingredients.$" addIcon={<PlusCircle className="text-dark" />} />
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
