import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const RecipeInstructions = ({ instructions }) => (
  <Card
    style={{ width: '18rem' }}
    className="h-auto m-auto g-0 gap-0"
  >
    <Accordion
      defaultActiveKey={0}
      className="p-0 m-0 g-0"
    >
      <Accordion.Item eventKey={0} className="p-0 m-0 g-0">
        <Accordion.Header className="h-auto p-0 m-0 g-0 text-center flex-row bg-black">Instructions:</Accordion.Header>
        <Accordion.Body
          className="pt-0 m-0"
          style={{ maxHeight: '50vh', overflowY: 'auto' }}
        >
          <Card.Text className="m-0 p-0">{instructions}</Card.Text>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Card>
);

// Require a document to be passed to this component.
RecipeInstructions.propTypes = {
  instructions: PropTypes.string.isRequired,
};

export default RecipeInstructions;
