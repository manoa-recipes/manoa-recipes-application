import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Ingredients } from '../../api/ingredients/Ingredients';
import { Recipes } from '../../api/recipes/Recipes';
import { RecipesIngredients } from '../../api/recipes/RecipesIngredients';
import LoadingSpinner from '../components/LoadingSpinner';

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
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
const CustomMenu = React.forwardRef(
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
          placeholder="Type an ingredient..."
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
const SearchRecipes = () => {
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
  let toggleText = 'Ingredient';
  const itemClicked = (ref) => {
    console.log(toggleText);
    toggleText = ref;
    console.log(toggleText);
  };

  // Component that displays the whole page: search bar as a form and results as a card group or list group
  return (ready ? (
    <Container>
      <Row className="align-items-center">
        <Col>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
              {}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
              {ingredients.map(ingredient => <Dropdown.Item eventKey={ingredient._id} onClick={itemClicked(ingredient.name)}>{ingredient.name}</Dropdown.Item>)}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default SearchRecipes;
