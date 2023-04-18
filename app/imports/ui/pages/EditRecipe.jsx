import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { DashCircle, PlusCircle } from 'react-bootstrap-icons';
import { AutoField, AutoForm, ErrorsField, HiddenField, ListAddField, ListDelField, ListField, ListItemField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useParams } from 'react-router';
import { Recipes } from '../../api/recipes/Recipes';
import LoadingSpinner from '../components/LoadingSpinner';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import { updateRecipeMethod } from '../../startup/both/Methods';
import { RecipeFormSchema } from '../forms/RecipeFormInfo';

/* Bridge for the form */
const bridge = new SimpleSchema2Bridge(RecipeFormSchema);

/** This function renders the Recipe information as an Autoform for editing.
 *   The object id is extracted from the URL. */
const EditRecipe = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
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
    console.log('useTracker:\n  user: ', user, '\n  Admin: ', isAdmin, '\n  Owner: ', isOwner, '\n  Edit Access: ', isAdmin || isOwner);

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
      }
    });
  };
  // console.log('EditRecipe rendering:\n  Ready: ', ready, '\n  Recipe: ', recipe, '\n  Model: ', model);
  /* If: subscriptions are ready and the recipe is defined: Render the page
  *  Else: render the loading spinner */
  return ready && editAccess ? (
    <Container className="p-2 text-end">
      <AutoForm model={model} schema={bridge} onSubmit={data => submit(data)} validate="onChange">
        <Card className="text-center">
          <Card.Header><Card.Title><h2>Edit Recipe</h2></Card.Title></Card.Header>
          <Card.Header>
            <Col>
              <Row><AutoField name="name" /></Row>
              <Row><TextField name="image" /></Row>
              <Row>
                <Col><TextField name="time" /></Col>
                <Col><NumField name="servings" key="servings" decimal={null} /></Col>
              </Row>
            </Col>
          </Card.Header>
          <Card.Body>
            <ListField name="ingredients" className="bg-light text-dark align-items-center" formNoValidate>
              <ListItemField name="$">
                <HiddenField name="recipe" value={recipe.name} />
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
            <HiddenField name="owner" value={recipe.owner} />
            <SubmitField value="Submit" />
            <ErrorsField />
          </Card.Body>
        </Card>
      </AutoForm>
    </Container>
  ) : <LoadingSpinner />;

};

export default EditRecipe;
