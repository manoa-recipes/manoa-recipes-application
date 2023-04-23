import React, { useState, forwardRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Dropdown, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../LoadingSpinner';
import { Ingredients } from '../../../api/ingredients/Ingredients';
import { Recipes } from '../../../api/recipes/Recipes';
import { RecipesIngredients } from '../../../api/recipes/RecipesIngredients';

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
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <Button
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
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
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
      </div>
    );
  },
);
const SearchRecipeBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, recipes, ingredients, recipeIngredients } = useTracker(() => {
    const sub1 = Meteor.subscribe(Ingredients.userPublicationName);
    const sub2 = Meteor.subscribe(Recipes.userPublicationName);
    const sub3 = Meteor.subscribe(RecipesIngredients.userPublicationName);
    const rdy = sub1.ready() && sub2.ready() && sub3.ready();
    return {
      ready: rdy,
      recipes: Recipes.collection.find({}).fetch(),
      ingredients: Ingredients.collection.find({}).fetch(),
      recipeIngredients: RecipesIngredients.collection.find({}).fetch(),
    };
  }, []);

  // Component that displays the whole page: search bar as a form and results as a card group or list group
  return (ready ? (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        Custom toggle
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu}>
        {ingredients.map(ingredient => (<Dropdown.Item eventKey={ingredient.name}>{ingredient.name}</Dropdown.Item>))}
        <Dropdown.Item eventKey="1">Red</Dropdown.Item>
        <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
        <Dropdown.Item eventKey="3" active>
          Orange
        </Dropdown.Item>
        <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : <LoadingSpinner />);
};

export default SearchRecipeBar;
