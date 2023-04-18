import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { array } from 'prop-types';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField } from 'uniforms-bootstrap5';
import { Button, Card, Col, Row, Container, Dropdown, FormControl, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';
import RecipeCard from '../components/RecipeCard';

const SearchRecipes = () => {
  const [field, setField] = useState('recipe');
  const [term, setTerm] = useState([]);
  const [results, setResults] = useState([]);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipes, recipeIngredients } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const sub3 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    return {
      ready: rdy,
      recipes: Recipes.collection.find({}).fetch(),
      recipeIngredients: RecipesIngredients.collection.find({}).fetch(),
    };
  }, []);

  const ingredientNames = _.pluck(Ingredients.collection.find({}).fetch(), 'name');
  // console.log(ingredientNames);
  const bridge = new SimpleSchema2Bridge(new SimpleSchema({
    ingredients: { label: 'Ingredients', type: array, optional: true },
    'ingredients.$': { type: String, allowedValues: ingredientNames },
  }));
  const onSelect = (key, event, ref) => {
    setField(event);
    // console.log('Event: ', event, '\nKey: ', key, '\nRef: ', ref);
  };

  /* FormControl Reference */
  let fRef = null;

  // Component that displays the whole page: search bar as a form and results as a card group or list group
  return (ready ? (
    <Container fluid className="p-0">
      <Col>
        <Row>
          <Card className="py-1">
            <InputGroup>
              <InputGroup.Text>Search By:</InputGroup.Text>
              <Dropdown onSelect={(key, event) => onSelect(event, key)}>
                <Dropdown.Toggle>{field === 'recipe' ? 'Recipe Name' : 'Ingredient'}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="recipe" active={field === 'recipe'}>Recipe Name</Dropdown.Item>
                  <Dropdown.Item eventKey="ingredient" active={field === 'ingredient'}>Ingredient</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <FormControl
                key="search-field"
                ref={ref => { fRef = ref; }}
                placeholder={field === 'recipe' ? 'Type a Recipe Name...' : 'Type an Ingredient...'}
              />
              <Button variant="light" value="submit"><Search /></Button>
            </InputGroup>
          </Card>
        </Row>
        {field === 'recipe' ? (
          <Row xs={1} md={2} lg={3} className="p-1 g-4 justify-content-center">
            {recipes.map((recipe) => (<Col key={recipe._id}><RecipeCard recipe={recipe} /></Col>))}
          </Row>
        ) : (
          <Row className="pb-2 text-dark">
            <Col xs={4} md={3} lg={2} className="align-items-center justify-content-end">
              <AutoForm schema={bridge}>
                <SelectField
                  name="ingredients.$"
                  label=""
                  allowedValues={ingredientNames}
                  multiple
                  checkboxes
                  onChange={(event) => onChange(event)}
                />
              </AutoForm>
            </Col>
            <Col />
          </Row>
        )}
      </Col>
    </Container>
  ) : <LoadingSpinner />);
};

export default SearchRecipes;
