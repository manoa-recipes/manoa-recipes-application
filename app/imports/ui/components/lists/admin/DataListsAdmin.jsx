import React from 'react';
import { Card } from 'react-bootstrap';
import { Profiles } from '../../../../api/profiles/Profiles';
import { Vendors } from '../../../../api/vendors/Vendors';
import { Recipes } from '../../../../api/recipes/Recipes';
import { Ingredients } from '../../../../api/ingredients/Ingredients';
import AdminDataList from './AdminDataList';

/* Organize lists */
const DataListsAdmin = () => (
  <Card bg="light">
    <AdminDataList collectionName={Ingredients.name} />
    <AdminDataList collectionName={Profiles.name} />
    <AdminDataList collectionName={Vendors.name} />
    <AdminDataList collectionName={Recipes.name} />
  </Card>
);

export default DataListsAdmin;
