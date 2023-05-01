import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, BoolField, ErrorsField, HiddenField, ListDelField, ListField, ListItemField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import { addRecipeMethod } from '../../../startup/both/Methods';
import { RecipeFormSchema } from '../../forms/RecipeFormInfo';
import { Recipes } from '../../../api/recipes/Recipes';
import LoadingSpinner from '../../components/LoadingSpinner';

// Defined in '../../forms/RecipeFormInfo.js'
const recipeBridge = new SimpleSchema2Bridge(RecipeFormSchema);

/* Renders the AddRecipe page for adding a document. */
const AddRecipe = () => {
  const owner = Meteor.user()?.username;
  // The recipe name (make it undefined to force the user to interact with it)
  const [name, setName] = useState(undefined);
  // Whether the recipe name is taken
  const [valid, setValid] = useState(false);
  // console.log('Logged in user: ', owner);
  const { ready, recipes } = useTracker(() => {
    const subscription = Meteor.subscribe(Recipes.userPublicationName);
    // Data is ready
    const rdy = subscription.ready();
    return {
      recipes: _.pluck(Recipes.collection.find({}).fetch(), 'name'),
      ready: rdy,
    };
  }, []);
  const handleChange = (event) => {
    const value = event.target.value;
    setName(value);
    // Prevent submit for invalid input
    if (recipes.includes(value) || value.length === 0) {
      setValid(false);
    } else { setValid(true); }
  };
  const submit = (data) => {
    if (valid) {
      const { image, instructions, time, servings, ingredients } = data;
      // Extend the form data of the join docs at the moment of submit
      ingredients.map(ingredient => _.extend({}, ingredient, { recipe: name }));
      Meteor.call(addRecipeMethod, { name, owner, image, instructions, time, servings, ingredients }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Recipe added successfully!', 'success');
        }
      });
    } else { swal('Error', 'Recipe name Taken!', 'error'); }
  };
  return ready ? (
    <Container className="p-2 text-end">
      <AutoForm schema={recipeBridge} onSubmit={data => submit(data)}>
        <Card className="text-center">
          <Card.Header><Card.Title><h2>Add Recipe</h2></Card.Title></Card.Header>
          <Row xs={12}>
            <Col xs={12} md={6}>
              <Card.Body>
                <Col>
                  <Row
                    onChange={handleChange}
                  >
                    <TextField
                      name="name"
                      placeholder="Type a recipe Name..."
                      value={name}
                      defaultValue={name}
                      className="mb-auto"
                      autoComplete={null}
                    />
                  </Row>
                  <Row><TextField name="image" placeholder="..." className="mb-auto" /></Row>
                  <Row><TextField name="source" placeholder="..." className="mb-auto" /></Row>
                  <Row>
                    <Col><TextField name="time" placeholder="..." className="mb-auto" /></Col>
                    <Col><NumField name="servings" decimal={null} className="mb-auto" /></Col>
                    <Col><BoolField name="vegan" className="mb-auto" /></Col>
                    <Col><BoolField name="glutenFree" className="mb-auto" /></Col>
                  </Row>
                </Col>
                <LongTextField name="instructions" />
              </Card.Body>
            </Col>
            <Col xs={12} md={6} className="justify-content-center text-center">
              <Card.Body>
                <ListField name="ingredients" className="align-items-center" addIcon={<PlusCircle className="text-dark" />} removeIcon={null}>
                  <ListItemField name="$">
                    <HiddenField name="recipe" value={name} />
                    <Row xs={12} className="align-items-center g-0">
                      <Col xs={1}><ListDelField name="" removeIcon={<DashCircle color="text-dark" />} /></Col>
                      <Col xs={2}><NumField name="quantity" decimal={false} className="mb-auto" /></Col>
                      <Col xs={3}><TextField name="size" className="mb-auto" /></Col>
                      <Col><TextField name="ingredient" placeholder="Type an ingredient..." className="mb-auto" /></Col>
                    </Row>
                  </ListItemField>
                </ListField>
              </Card.Body>
            </Col>
          </Row>
          <Card.Body className="text-end">
            <HiddenField name="owner" value={owner} />
            <SubmitField value="Submit" />
            <ErrorsField />
          </Card.Body>
        </Card>
      </AutoForm>
    </Container>
  ) : <LoadingSpinner />;
};

export default AddRecipe;
