import React, { forwardRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Button, Card, Col, Row, Container, Dropdown, FormControl, InputGroup, Form, SplitButton, FormSelect, ListGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';
import DropdownMenu from 'react-bootstrap/DropdownMenu';

/* Possible search fields */
const searchFields = [
  { keyVal: 'recipe', fieldName: 'Recipe Name' },
  { keyVal: 'ingredient', fieldName: 'Ingredients' },
  { keyVal: 'owner', fieldName: 'Chef' },
];

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const TempToggle = forwardRef(({ children, onClick }, ref) => {
  console.log('TempToggle ref param: ', ref, '\n  children: ', children, '\n  onClick: ', onClick);
  return (
    <Button
      title="TempToggle"
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </Button>
  );
});

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const TempMenu = forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy, show }, ref) => {
    console.log('TempMenu ref param: ', ref);
    const [value, setValue] = useState('');

    return (
      <Container
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) => !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </Container>
    );
  },
);

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
  console.log('SearchRecipes post-useTracker:\n  ready: ', ready, '\n  selected: ', selected, '\n  field: ', searchFields[field], '\n  terms: ', terms);

  const fieldSelect = (event, key) => {
    console.log('searchFieldSelect:\n  event: ', event, '\n  key: ', key);
    setField(key);
  };
  const handleSearchTerms = (event) => {
    console.log('handleSearchTerms:\n  event: ', event);
  };
  const handleSearchMenu = (event) => {
    console.log('handleSearchMenu:\n  event: ', event);
  };

  /* FormControl Reference */
  let fRef = null;

  /* Component that displays the whole page: search bar as a form and results as a card group or list group
  *  Dropdown.Menu catches _events_: _sources_ from it's children:
  *    onSelect, Dropdown.Item
  */
  return (ready && selected !== undefined && terms !== undefined ? (
    <Form>
      <InputGroup>
        <InputGroup.Text>Search By:</InputGroup.Text>
        <Dropdown
          key="field-select"
          onSelect={(key, e) => fieldSelect(e, key)}
        >
          <Dropdown.Toggle>{searchFields[field].fieldName}</Dropdown.Toggle>
          <Dropdown.Menu>
            {searchFields.map((searchField, index) => (
              <Dropdown.Item
                key={searchField.keyVal}
                eventKey={index}
              >
                {searchField.fieldName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Col>
          <FormControl
            type="search"
            ref={ref => { fRef = ref; }}
            placeholder="Type to filter..."
            onChange={(e) => handleSearchMenu(e)}
            value={searchTerm}
          />
          <ListGroup
            as={Dropdown.Menu}
            onSelect={(key, e) => handleSearchMenu(e, key)}
            show={focused}
            scr
          >
            {terms.map((term, index) => (!selected[index] ? (<Dropdown.Item key={index} eventKey={index}>{term}</Dropdown.Item>) : ''))}
          </ListGroup>
        </Col>
        <Button value="submit"><Search /></Button>
      </InputGroup>
    </Form>
  ) : <LoadingSpinner />);
};

export default SearchRecipes;
