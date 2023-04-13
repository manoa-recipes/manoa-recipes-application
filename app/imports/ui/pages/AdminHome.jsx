import React from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import DataListsAdmin from '../components/DataListsAdmin';
import RelationListsAdmin from '../components/RelationListsAdmin';
import IndividualRecipe from '../components/IndividualRecipe';
import SearchRecipes from './SearchRecipes';

const testRecipe = {
  name: 'Scratch Pasta Sauce',
  owner: 'john@foo.com',
  image: '',
  instructions: 'Requires a stove-top or hot-plate and a pot. Put pot on low-medium heat, add olive oil and diced onion, salt and pepper, and cook until onion is translucent. Add diced garlic and cook for ten more minutes. Mix tomato paste in and cook for five more minutes. Mix in three cups of water and cook five more minutes. Add and mix tomato sauce and chopped basil and reduce heat to low for 25 more minutes.  Note: Season salt and pepper to taste.',
  time: 60,
  servings: 4,
};
const testRecipe2 = {
  name: 'Default Salad',
  owner: 'jane@foo.com',
  image: '',
  instructions: 'Wash the lettuce and tomato thoroughly.  Assemble the chopped lettuce and tomato.  ',
  time: 10,
  servings: 2,
};

/* This component is merely to organize all admin data */
const AdminHome = () => (
  <Container className="p-0 text-center">
    <Tabs fill>
      <Tab eventKey="relaDb" title="Relational Collections">
        <RelationListsAdmin />
      </Tab>
      <Tab eventKey="dataDb" title="Data Collections">
        <DataListsAdmin />
      </Tab>
      <Tab eventKey="tests" title="Page Tests">
        <Tabs fill>
          <Tab eventKey="recipe" title="Individual Recipes">
            <IndividualRecipe recipe={testRecipe2} />
            <IndividualRecipe recipe={testRecipe} />
          </Tab>
          <Tab eventKey="search" title="Search Test">
            <SearchRecipes />
          </Tab>
        </Tabs>
      </Tab>
    </Tabs>
  </Container>
);

export default AdminHome;
