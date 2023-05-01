import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Table, Card, Button, Row, Col } from 'react-bootstrap';
import { Star } from 'react-bootstrap-icons';
import LoadingSpinner from '../../LoadingSpinner';
import AdminDataListItem from './AdminDataListItem';
import { resetCollectionMethod, refillCollectionMethod } from '../../../../startup/both/Methods';
import { getCollection } from '../../../../startup/both/CollectionHelpers';

/** Show the list with PAGINATION, if the list is long, using numElements.
  * ****NOT DONE**** */
// Function to render a collection as a list.  ex. param: <AdminDataList collectionName={ Recipes.name, numElements }
const AdminDataList = ({ collectionName, numElements }) => {
  // The collection based on the name given
  const collection = getCollection(collectionName);
  // Schema of the collection
  const schema = collection?.schema._schema;
  /** USE TRACKER */
  // Extract the documents from the collection
  const { ready, documents } = useTracker(() => {
    const subscription = Meteor.subscribe(collection?.userPublicationName);
    // Data is ready
    const rdy = subscription.ready();
    return {
      documents: collection?.collection.find({}).fetch(),
      ready: rdy,
    };
  }, []);
  const handleReset = () => {
    Meteor.call(resetCollectionMethod, { collectionName }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', `${collectionName} cleared!`, 'success');
      }
    });
  };
  const handleRefill = () => {
    Meteor.call(refillCollectionMethod, { collectionName }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', `${collectionName} Refilled!`, 'success');
      }
    });
  };
  if (!ready) { return (<LoadingSpinner />); }
  return (ready ? (
    <Card.Body>
      <Col>
        <Row>
          <Col><Button onClick={handleReset}>Reset Data</Button></Col>
          <Col><Button onClick={handleRefill}>Fill Data</Button></Col>
        </Row>
        <Row>
          <Table striped bordered size="sm" className="align-items-center">
            <thead>
              <tr>
                <th>_id (Edit)</th>
                {collection?.schema._schemaKeys.map((field, index) => (
                  <th key={index}>
                    {schema[field].label} {(schema[field].index) ? (<Star />) : ''}
                  </th>
                ))}
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(document => (
                <AdminDataListItem
                  key={document._id}
                  document={document}
                  collectionName={collectionName}
                />
              ))}
            </tbody>
          </Table>
        </Row>
      </Col>
    </Card.Body>
  ) : <LoadingSpinner />);
};
AdminDataList.propTypes = {
  collectionName: PropTypes.string.isRequired,
  numElements: PropTypes.number.isRequired,
};
export default AdminDataList;
