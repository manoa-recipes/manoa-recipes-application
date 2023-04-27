import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';
import { AutoForm, TextField } from 'uniforms-bootstrap5';
import { Search } from 'react-bootstrap-icons';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

const bridge = new SimpleSchema2Bridge(new SimpleSchema({ name: { type: String, defaultValue: '' } }));
const SearchResults = () => {
  const [formTerm, setFormTerm] = useState('');
  const handleSearchMenu = (e) => console.log(e);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients, recipes, recipeIngredients } = useTracker(() => {
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
  }, [terms]);
  console.log(`SearchResults: ${formTerm}`);
  return (ready ? (
    <Container fluid className="bg-black flex-fill">
      <AutoForm
        className="p-0 m-0 g-0 gap-0"
        schema={bridge}
        model={formTerm}
        onSubmit={(data) => handleSearchMenu(data)}
      >
        <Row className="grid g-0 p-0 m-0 align-items-center">
          <Col xs>
            <TextField
              name="term"
              type="search"
              label={null}
              placeholder="Search.."
              className="h-auto w-auto mb-auto"
              inputClassName="rounded-0 rounded-start"
              value={formTerm.name}
              onChange={(val) => setFormTerm(val)}
            />
          </Col>
          <Col xs={1} className="w-auto">
            <Button
              className="rounded-0 rounded-end"
              href={`/search/'${formTerm.term}'`}
            >
              <Search />
            </Button>
          </Col>
        </Row>
      </AutoForm>
    </Container>
  ) : <LoadingSpinner />);
};

export default SearchResults;
