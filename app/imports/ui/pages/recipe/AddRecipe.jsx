import React from 'react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, ListAddField, ListDelField, ListField, ListItemField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import { addRecipeMethod } from '../../../startup/both/Methods';
import { RecipeFormSchema } from '../../forms/RecipeFormInfo';

const recipeBridge = new SimpleSchema2Bridge(RecipeFormSchema);

/* Renders the AddRecipe page for adding a document. */
const AddRecipe = () => {
  const owner = Meteor.user().username;
  // console.log('Logged in user: ', owner);

  // On submit, insert the data.
  const submit = (data) => {
    const { name, image, instructions, time, servings, ingredients } = data;
    Meteor.call(addRecipeMethod, { name, owner, image, instructions, time, servings, ingredients }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe added successfully', 'success');
      }
    });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  return (
    <Container className="p-2 text-end">
      <AutoForm schema={recipeBridge} onSubmit={data => submit(data)}>
        <Card className="text-center">
          <Card.Header><Card.Title><h2>Add Recipe</h2></Card.Title></Card.Header>
          <Card.Header>
            <Col>
              <Row><TextField name="name" placeholder="Type a recipe Name..." /></Row>
              <Row><TextField name="image" placeholder="..." /></Row>
              <Row>
                <Col><NumField name="time" decimal={null} /></Col>
                <Col><NumField name="servings" decimal={null} /></Col>
              </Row>
            </Col>
          </Card.Header>
          <Card.Body>
            <ListField name="ingredients" className="bg-light text-dark align-items-center" formNoValidate>
              <ListItemField name="$">
                <HiddenField name="recipe" defaultValue="recipe name" />
                <Row className="align-items-center">
                  <Col xs={1}><ListDelField name="" removeIcon={<DashCircle color="text-dark" />} /></Col>
                  <Col xs={3} md={2}><NumField name="quantity" decimal={false} /></Col>
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
            <HiddenField name="owner" value={owner} />
            <SubmitField value="Submit" />
            <ErrorsField />
          </Card.Body>
        </Card>
      </AutoForm>
    </Container>
  );
};

export default AddRecipe;
