import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Table, Card, Accordion } from 'react-bootstrap';
import { Profiles } from '../../../api/profiles/Profiles';
import { Vendors } from '../../../api/vendors/Vendors';
import { Recipes } from '../../../api/recipes/Recipes';
import { Ingredients } from '../../../api/ingredients/Ingredients';
import AdminDataList from './lists/AdminDataList';

/* Organize all admin data */
const DataListsAdmin = () => (
  <Card bg="light">
    <AdminDataList collectionName={Ingredients.name} />
    <AdminDataList collectionName={Profiles.name} />
    <AdminDataList collectionName={Vendors.name} />
    <AdminDataList collectionName={Recipes.name} />
  </Card>
);

export default DataListsAdmin;
