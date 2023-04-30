import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Navigate } from 'react-router-dom';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import { AutoField, AutoForm, BoolField, ErrorsField, HiddenField, ListAddField, ListDelField, ListField, ListItemField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useParams } from 'react-router';
import { Recipes } from '../../../api/recipes/Recipes';
import LoadingSpinner from '../../components/LoadingSpinner';
import { RecipesIngredients } from '../../../api/recipes/RecipesIngredients';
import { updateRecipeMethod } from '../../../startup/both/Methods';
import { RecipeFormSchema } from '../../forms/RecipeFormInfo';
import NotAuthorized from '../NotAuthorized';

/* Bridge for the form */
const bridge = new SimpleSchema2Bridge(RecipeFormSchema);

/** This function renders the Recipe information as an Autoform for editing.
 *   The object id is extracted from the URL. */
const EditRecipe = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const [redirect, setRedirect] = useState(false);
  // console.log('EditRecipe called:\n  _id: ', _id);

  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { recipe, startIngredients, editAccess, ready } = useTracker(() => {
    // Access to Recipes collection.
    const sub1 = Meteor.subscribe(Recipes.userPublicationName);
    // Access to RecipesIngredients collection.
    const sub2 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    // Determine if the subscriptions are ready
    const rdy = sub1.ready() && sub2.ready() && Roles.subscription.ready();

    /* Output to console for tracing bugs */
    // console.log('useTracker collections:', '\n  Recipes: ', Recipes.collection.find({}).fetch(), '\n  RecipesIngredients: ', RecipesIngredients.collection.find({}).fetch());

    /* The specific recipe document */
    const document = Recipes.collection.findOne(_id);
    /* Logged in users username */
    const user = (Meteor.userId() !== null) ? Meteor.user()?.username : 'tempUser';
    const isAdmin = (Meteor.userId() !== null) ? Roles.userIsInRole(Meteor.userId(), 'admin') : false;
    const isOwner = (user === (document ? document.owner : 'tempOwner'));

    /** Ensure document is defined before accessing the name field */
    const ingredientItems = document ? RecipesIngredients.collection.find({ recipe: document.name }).fetch() : [];

    /* Output to console for tracing bugs */
    // console.log('useTracker documents:', '\n  recipe: ', document, '\n  ingredients: ', ingredientItems);
    // console.log('useTracker:\n  user: ', user, '\n  Admin: ', isAdmin, '\n  Owner: ', isOwner, '\n  Edit Access: ', isAdmin || isOwner);
    return {
      recipe: document,
      startIngredients: ingredientItems,
      editAccess: isAdmin || isOwner,
      ready: rdy,
    };
  }, [_id]);

  // A model to fill the form with starting data
  const model = _.extend({}, recipe, { ingredients: startIngredients });

  // console.log('Form Model: ', model);
  /** This function needs to properly call the method to update the database */
  const submit = (data) => {
    const { name, owner, image, instructions, time, servings, ingredients } = data;
    // console.log('UpdateRecipeMethod being called:\n  input: ', { _id, name, owner, image, instructions, time, servings, ingredients });
    Meteor.call(updateRecipeMethod, { _id, name, owner, image, instructions, time, servings, ingredients }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Recipe updated successfully', 'success');
        setRedirect(true);
      }
    });
  };
  // console.log('EditRecipe rendering:\n  Ready: ', ready, '\n  Recipe: ', recipe, '\n  Model: ', model);
  // Redirect the user to the ViewRecipe page for the edited document after submit
  if (redirect) { return (<Navigate to={`/view-recipe/${_id}`} />); }
  if (!ready) { return (<LoadingSpinner />); }
  return editAccess ? (
    <Container className="p-2 text-end">
      <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)} validate="onChange">
        <Card className="text-center">
          <Card.Header><Card.Title><h2>Edit {recipe.name}</h2></Card.Title></Card.Header>
          <Row xs={12}>
            <Col xs={12} md={6}>
              <Card.Body>
                <Col>
                  <Row><TextField name="name" className="mb-auto" /></Row>
                  <Row><TextField name="image" placeholder="..." className="mb-auto" /></Row>
                  <Row><TextField name="source" placeholder="..." className="mb-auto" /></Row>
                  <Row>
                    <Col><TextField name="time" placeholder="..." className="mb-auto" /></Col>
                    <Col><NumField name="servings" decimal={null} className="mb-auto" /></Col>
                    <Col><BoolField name="vegan" className="mb-auto" /></Col>
                    <Col><BoolField name="glutenFree" className="mb-auto" /></Col>
                  </Row>
                </Col>
                <LongTextField name="instructions" wrapClassName="h-auto" />
              </Card.Body>
            </Col>
            <Col xs={12} md={6} className="justify-content-center text-center">
              <Card.Body>
                <ListField name="ingredients" className="align-items-center" addIcon={<PlusCircle className="text-dark" />} removeIcon={null}>
                  <ListItemField name="$">
                    <HiddenField name="recipe" value={recipe.name} />
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
            <HiddenField name="owner" value={recipe.owner} />
            <SubmitField value="Submit" />
            <ErrorsField />
          </Card.Body>
        </Card>
      </AutoForm>
    </Container>
  ) : <NotAuthorized />;
};

export default EditRecipe;
