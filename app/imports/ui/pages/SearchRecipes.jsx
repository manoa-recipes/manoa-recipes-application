import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';

// Schema for the search bar
const formSchema = new SimpleSchema({
  searchBy: {
    type: String,
    allowedValues: ['name', 'ingredient'],
    defaultValue: 'name',
  },
  searchTerm: {
    type: String,
    defaultValue: '',
  },
  filterBy: {
    type: String,
    allowedValues: ['none', 'vegan', 'glutenFree'],
    defaultValue: 'none',
  },
});
const bridge = new SimpleSchema2Bridge(formSchema);

// A component to hold the search bar and search results
/** 1) The form extracts search data from the user input on the search bar.
 *  2) The component displays the search results as a list under the bar. */
const SearchRecipes = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const sub3 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    return {
      ready: rdy,
    };
  }, []);
  // Sub-Component to display the list of search results
  const submit = (data, fRef) => {};
  const searchByChanged = (data) => {};
  let fRef = null;
  // Component that displays the whole page: search bar as a form and results as a card group or list group
  return (ready ? (
    <Container>
      <Card title="SearchBar">
        <Card.Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Row className="align-items-center">
              <Col><SelectField name="searchBy" onChange={data => searchByChanged(data)} /></Col>
              <Col><TextField name="searchTerm" /></Col>
              <Col><SelectField name="filterBy" /></Col>
              <Col><SubmitField value="submit" /></Col>
            </Row>
          </AutoForm>
        </Card.Header>
        <Card.Body />
      </Card>
    </Container>
  ) : <LoadingSpinner />);
};

export default SearchRecipes;
