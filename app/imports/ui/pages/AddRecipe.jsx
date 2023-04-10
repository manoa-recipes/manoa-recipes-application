import React from 'react';
// import swal from 'sweetalert';
// import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { AutoForm, ErrorsField, ListField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';

// Schema to specify the structure of the data to appear in the AddRecipe form.
const recipeFormSchema = new SimpleSchema({
  // Recipes schema
  name: { type: String, index: true, unique: true },
  // owner: String, is retrieved from the user, not the form
  image: { type: String, optional: true, defaultValue: '' },
  instructions: { type: String, optional: false },
  time: { type: Number, optional: false },
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
//
// const RecipeIngredient = () => (
//   <Row>
//     <Col><TextField name="ingredient" /></Col>
//     <Col><TextField name="size" /></Col>
//     <Col><NumField name="quantity" decimal={null} /></Col>
//   </Row>
// );

/* Renders the AddRecipe page for adding a document. */
const AddRecipe = () => {

  // On submit, insert the data.
  const submit = () => {};
  /**
  const submit = (data, formRef) => {
    const { name, quantity, condition } = data;
    const owner = Meteor.user().username;
    Stuffs.collection.insert(
      { name, quantity, condition, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      },
    );
  };
   */

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="p-2">
      <AutoForm ref={ref => { fRef = ref; }} schema={recipeBridge} onSubmit={data => submit(data, fRef)}>
        <Card>
          <Card.Header>
            <Card.Title className="text-center">Add Recipe</Card.Title>
          </Card.Header>
          <Card.Body>
            <Tabs fill>
              <Tab eventKey="instr" title="Instructions">
                <Col>
                  <Row><TextField name="name" /></Row>
                  <Row><TextField name="image" /></Row>
                  <Row>
                    <Col><NumField name="time" decimal={null} /></Col>
                    <Col><NumField name="servings" decimal={null} /></Col>
                  </Row>
                </Col>
                <Col>
                  <LongTextField name="instructions" />
                </Col>
              </Tab>
              <Tab eventKey="ingre" title="Ingredients">
                <ListField name="ingredients" className="bg-light text-dark" addIcon={<PlusCircle className="text-dark" />} removeIcon={<DashCircle className="text-dark" />} />
              </Tab>
            </Tabs>
            <SubmitField value="Submit" />
            <ErrorsField />
          </Card.Body>
        </Card>
      </AutoForm>
    </Container>
  );
};

export default AddRecipe;
