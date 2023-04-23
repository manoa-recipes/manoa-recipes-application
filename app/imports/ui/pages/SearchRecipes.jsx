import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Button, Card, Col, Row, Container, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { Search } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';

/* Possible search fields */
const searchFields = [
  { keyVal: 'recipe', fieldName: 'Recipe Name' },
  { keyVal: 'ingredient', fieldName: 'Ingredients' },
  { keyVal: 'owner', fieldName: 'Chef' },
];

const SearchRecipes = () => {
  // The index of the search field
  const [field, setField] = useState(0);
  // The current input word
  const [searchTerm, setSearchTerm] = useState('');
  // The terms in the list
  const [terms, setTerms] = useState(undefined);
  // The selected terms of the list
  const [selected, setSelected] = useState(undefined);
  // The FormControl is focused
  const [focused, setFocused] = useState(false);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredientsDocs, recipes, recipeIngredients } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const sub3 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    return {
      ready: rdy,
      ingredientsDocs: Ingredients.collection.find({}).fetch(),
      recipes: Recipes.collection.find({}).fetch(),
      recipeIngredients: RecipesIngredients.collection.find({}).fetch(),
    };
  }, []);
  if (ready && (selected === undefined)) {
    console.log('Initializing "selected" array.');
    setSelected(new Array(ingredientsDocs.length).fill(false));
  }
  if (ready && (terms === undefined)) {
    console.log('Initializing "terms" array (of ingredients).');
    setTerms(_.pluck(ingredientsDocs, 'name'));
  }

  const fieldSelect = (event, key) => {
    console.log('searchFieldSelect:\n  event: ', event, '\n  key: ', key);
    setField(key);
  };
  const handleSearchTerm = (event) => {
    console.log('handleSearchTerms:\n  event: ', event);
  };
  const handleSearchMenu = (event, key) => {
    console.log('handleSearchMenu:\n  event: ', event, '\n  key: ', key);
    switch (event.type) {
    case 'focus': setFocused(true); return;
    case 'blur': setFocused(false); return;
    case 'change': setSearchTerm(event.target.value); return;
    default: console.log('  Switch: Event type not found.');
    }
  };
  // Function to create an array based on:
  //   A list of possible terms (react state)
  //   A searchTerm (react state) to filter the list
  const applyFilter = () => {

  };
  // Flips the boolean at the key=index of the array
  const mutateSelected = (e) => {
    // React states must be set with a new array (normal array mutation causes problems)
    console.log('mutateSelected:\n  event: ', e, '\n  selected:\n', selected);
    // setSelected(selected.map((element, index) => ((index === key) ? !element : element)));
  };

  /* FormControl Reference */
  let fRef = null;

  // console.log(
  //   'SearchRecipes pre-render:\n  ready: ',
  //   ready,
  //   '\n  field: ',
  //   searchFields[field],
  //   '\n  terms: ',
  //   terms,
  //   '\n  selected: ',
  //   selected,
  //   '\n  focused: ',
  //   focused,
  //   '\n  searchTerm: ',
  //   searchTerm,
  // );

  return (ready && selected !== undefined && terms !== undefined ? (
    <InputGroup>
      <InputGroup.Text>Search By:</InputGroup.Text>
      <Dropdown
        id="search-by-field"
        onSelect={(key, e) => fieldSelect(e, key)}
      >
        <Dropdown.Toggle id="search-by-field-toggle">{searchFields[field].fieldName}</Dropdown.Toggle>
        <Dropdown.Menu id="search-by-field-menu">
          {searchFields.map((searchField, index) => (
            <Dropdown.Item
              id="search-by-field-item"
              key={searchField.keyVal}
              eventKey={index}
            >
              {searchField.fieldName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Col
        id="search-term-field"
        onFocus={(e) => handleSearchMenu(e)}
        onBlur={(e) => handleSearchMenu(e)}
      >
        <FormControl
          type="search"
          id="search-term-field-input"
          ref={ref => { fRef = ref; }}
          placeholder="Type to filter..."
          onChange={(e) => handleSearchMenu(e)}
          value={searchTerm}
        />
        <DropdownMenu
          id="search-term-field-menu"
          show={focused}
        >
          {terms.map((term, index) => (
            <DropdownItem
              key={index}
              eventKey={index}
            >
              {term}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Col>
      <Button value="submit"><Search /></Button>
    </InputGroup>
  ) : <LoadingSpinner />);
};

export default SearchRecipes;
