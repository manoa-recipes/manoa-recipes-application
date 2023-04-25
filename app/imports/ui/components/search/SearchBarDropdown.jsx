import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { Button, Col, Dropdown, InputGroup, FormControl, Row } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { Ingredients } from '../../../api/ingredients/Ingredients';
import { Recipes } from '../../../api/recipes/Recipes';
import LoadingSpinner from '../LoadingSpinner';

// Minimum length for the search term to call the function to filter the list
const searchTermMinimumLength = 2;

const SearchMenuItem = ({ data, index }) => (
  <Dropdown.Item
    href={(data.field === 'recipe') ? `/view-recipe/${data._id}` : `/search/'${data.name}'`}
    key={index}
  >
    {data.name}
  </Dropdown.Item>
);
SearchMenuItem.propTypes = {
  data: PropTypes.shape({
    term: PropTypes.string,
    field: PropTypes.string,
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const SearchBar = () => {
  // The current input word
  const [searchTerm, setSearchTerm] = useState('');
  // Boolean to show the Dropdown when the FormControl is focused/selected
  const [focused, setFocused] = useState(false);
  // Full list of search menu items
  const [fullList, setFullList] = useState(undefined);
  // Full list of search menu items
  const [filterList, setFilterList] = useState(undefined);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, ingredients, recipes } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const rdy = sub1.ready() && sub2.ready();
    return {
      ready: rdy,
      ingredients: Ingredients.collection.find({}).fetch(),
      recipes: Recipes.collection.find({}).fetch(),
    };
  }, []);
  const docToListItem = (element) => ({ term: searchTerm, field: element.field, name: element.name.toLowerCase(), _id: element._id });
  // Initialize the list when ready, and only if fullList hasn't been created yet
  if (ready && (fullList === undefined)) {
    // Build the list with the collections (both docs' unique keys are called "name"
    const initialList = recipes.map(recipe => docToListItem(_.extend({}, recipe, { field: 'recipe' }))).concat(ingredients.map(ingredient => docToListItem(_.extend({}, ingredient, { field: 'ingredient' }))));
    setFullList(initialList);
    setFilterList(initialList);
  }
  // Returns true when the string starts with the searchTerm
  const startsWithFilter = (element) => element.name.startsWith(searchTerm);
  // Returns true when the string contains the searchTerm, but only if it does not start with the searchTerm
  const includesFilter = (element) => element.name.includes(searchTerm) && (!element.name.startsWith(searchTerm));
  const termIsLongEnough = () => (searchTerm.length >= searchTermMinimumLength);
  const termHasChanged = () => { if (filterList.length > 0) { return searchTerm !== filterList[0].term; } return false; };

  /** Set a new filterList when conditions are met */
  if (fullList && termHasChanged() && termIsLongEnough()) {
    const startList = _.filter(fullList, startsWithFilter);
    const containList = _.filter(fullList, includesFilter);
    // If startList exists, concat containList onto it, else use containList
    const newFilter = startList ? _.filter(fullList, startsWithFilter).concat(containList) : containList;
    // At most there are three _.filter() calls with the above protocol
    if (newFilter.length === 0) {
      // If newFilter is still undefined then there are no results to display
      setFilterList([]);
    } else {
      // Make the new entry reference the current search term by recalling the item builders
      setFilterList(newFilter.map(item => docToListItem(item)));
    }
  }
  const handleSearchMenu = (event) => {
    // console.log('handleSearchMenu:\n  event: ', event);
    switch (event.type) {
    case 'focus': setFocused(true); return;
    case 'blur': setFocused(false); return;
    case 'change':
      setSearchTerm(event.target.value.toLowerCase());
      if (event.target.value.length < searchTermMinimumLength) {
        setFilterList(fullList);
      }
      return;
    default: console.log(`default: ${event.type}`);
    }
  };
  // console.log('SearchBar pre-render check:\n  ready: ', ready, '\n  focused: ', focused, '\n  searchTerm: ', searchTerm, '\n  fullList: ', fullList, '\n  filterList: ', filterList);

  return (ready && fullList ? (
    <InputGroup>
      <Col
        onBlur={(e) => handleSearchMenu(e)}
        onFocus={(e) => handleSearchMenu(e)}
      >
        <Row>
          <FormControl
            type="search"
            autoComplete="off"
            placeholder="Search..."
            onChange={(e) => handleSearchMenu(e)}
            onKeyDown={(e) => console.log('Form keyDown: ', e)}
            value={searchTerm}
          />
        </Row>
        <Row
          onSelect={(e) => console.log('Row onSelect: ', e)}
          onClick={(e) => console.log(e)}
        >
          <Dropdown
            show={focused}
            onSelect={(key, e) => console.log('Item Selected: ', e)}
            onClick={(e) => console.log(e)}
          >
            <Dropdown.Menu
              style={{ maxHeight: '25vh', overflowY: 'scroll' }}
            >
              {(filterList.length > 0) ? filterList.map((item, index) => (
                <SearchMenuItem key={item._id} data={item} index={index} />
              )) : (<Dropdown.ItemText>No Results</Dropdown.ItemText>)}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
      </Col>
      <InputGroup.Checkbox />
      <Button value="submit"><Search /></Button>
    </InputGroup>
  ) : <LoadingSpinner />);
};

export default SearchBar;
