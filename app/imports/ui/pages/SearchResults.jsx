import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { AutoForm, BoolField, TextField } from 'uniforms-bootstrap5';
import { Link } from 'react-router-dom';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';
import RecipeCard from '../components/recipe/RecipeCard';

const bridge = new SimpleSchema2Bridge(new SimpleSchema({
  name: { type: String, defaultValue: '' },
  vegan: { type: Boolean, defaultValue: false },
  glutenFree: { type: Boolean, defaultValue: false },
}));
// Minimum length for the search term to call the function to filter the list
const searchTermMinimumLength = 2;

/** ===CHANGE OR STYLE ME PLEASE=== */
// How the result is displayed
const Result = ({ document }) => (
  <Row className="m-1">
    <Card>
      {document.name.charAt(0).toUpperCase()}{document.name.slice(1)}
      <Link href={document.link} to={document.link} className="stretched-link" />
    </Card>
  </Row>
);
Result.propTypes = {
  document: PropTypes.shape({
    field: PropTypes.string,
    link: PropTypes.string,
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};
// Page which renders the search bar and the results
const SearchResults = () => {
  // The filter criteria
  const [formTerm, setFormTerm] = useState({ name: '', vegan: false, glutenFree: false });
  // Start with undefined and populate it with all data before render
  const [results, setResults] = useState(undefined);
  const [list, setList] = useState(undefined);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients, recipes } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const sub3 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    return {
      ready: rdy,
      ingredients: Ingredients.collection.find({}).fetch(),
      recipes: Recipes.collection.find({}).fetch(),
      recipeIngredients: RecipesIngredients.collection.find({}).fetch(),
    };
  }, []);
  // Helper function to convert two different documents into a new object with only the common fields
  const recordTerm = (element) => (_.extend({}, element, { term: formTerm.name }));
  // Initialize the list when ready, and only if it is undefined
  if (ready && (list === undefined)) {
    // Build the list with the collections (both docs' unique keys are called "name")
    // Then map through the entire list and record the search term from the form
    const initialList = recipes.map(recipe => _.extend({}, recipe, { field: 'recipe', link: `/view-recipe/${recipe._id}` }))
      .concat(ingredients.map(ingredient => _.extend({}, ingredient, { field: 'ingredient', link: `/view-by-ingredient/${ingredient._id}` })));
    setList(initialList);
    setResults(initialList.map(element => recordTerm(element)));
  }
  // Returns true when the string starts with the searchTerm
  const startsWithFilter = (element) => element.name.toLowerCase().startsWith(formTerm.name);
  // Returns true when the string contains the searchTerm, but only if it does not start with the searchTerm
  const includesFilter = (element) => element.name.toLowerCase().includes(formTerm.name) && (!startsWithFilter(element));
  const termIsLongEnough = () => (formTerm.name.length >= searchTermMinimumLength);
  const termHasChanged = () => { if (results?.length > 0) { return formTerm.name !== results[0].term; } return false; };

  // ===Set a new filterList when conditions are met===
  if (list && termHasChanged() && termIsLongEnough()) {
    const startList = _.filter(list, startsWithFilter);
    const containList = _.filter(list, includesFilter);
    // If startList exists, concat containList onto it, else use containList
    const newFilter = startList ? startList.concat(containList) : containList;
    if (newFilter?.length === 0) {
      // If newFilter is still undefined then there are no results to display
      setResults([]);
    } else {
      /** ===FILTER VEGAN AND GLUTEN FREE HERE, Above the setResults!=== */

      // Make the new entries reference the current search term
      setResults(newFilter.map(item => recordTerm(item)));
    }
  }
  // Save changes to the form across renders
  const handleFormChange = (val, field) => {
    // Unpack the formTerm data
    const { name, vegan, glutenFree } = formTerm;
    // Perform the correct operation to update the formTerm data
    switch (field) {
    case 'name':
      setFormTerm({ name: val.toLowerCase(), vegan, glutenFree });
      if (val.length < searchTermMinimumLength) { setResults(list); }
      break;
    case 'vegan': setFormTerm({ name, vegan: val, glutenFree }); break;
    case 'glutenFree': setFormTerm({ name, vegan, glutenFree: val }); break;
    default: console.log('Field not recognized!');
    }
  };
  /** ===CHANGE OR STYLE ME PLEASE=== */
  return ((ready && results !== undefined) ? (
    <Container fluid className="flex-fill" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <Col className="p-2">
        <Row>
          <AutoForm
            className="p-0 m-0 g-2"
            schema={bridge}
            model={formTerm}
          >
            <Row className="grid align-items-center">
              <Col xs={2}>
                <BoolField name="vegan" value={formTerm?.vegan} className="mb-auto" onChange={(val) => handleFormChange(val, 'vegan')} />
                <BoolField name="glutenFree" value={formTerm?.glutenFree} className="mb-auto" onChange={(val) => handleFormChange(val, 'glutenFree')} />
              </Col>
              <Col>
                <TextField
                  name="name"
                  type="search"
                  label="Filter"
                  placeholder="Search.."
                  className="h-auto w-auto mb-auto"
                  value={formTerm?.name}
                  onChange={(val) => handleFormChange(val, 'name')}
                />
              </Col>
            </Row>
          </AutoForm>
        </Row>
        <Row>
          <Card>
            <Col className="p-1">
              {(results?.length > 0) ? (_.filter(results, function (element) { return element.field === 'ingredient'; }).map(result => <Result key={result?._id} document={result} />)) : (<div>No results</div>)}
            </Col>
          </Card>
        </Row>
        <Row>
          <Col>
            <Col className="text-center">
              <h2>All Recipes</h2>
            </Col>
            <Row xs={1} md={2} lg={3} className="g-4">
              {_.filter(results, function (element) { return element.field === 'recipe'; }).map((recipe) => (<Col key={recipe._id}><RecipeCard recipe={recipe} /></Col>))}
            </Row>
          </Col>
        </Row>
      </Col>
    </Container>
  ) : <LoadingSpinner />);
};

export default SearchResults;
