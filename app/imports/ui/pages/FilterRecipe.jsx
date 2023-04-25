import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Card, Badge, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { AutoForm, SelectField, SubmitField } from 'uniforms-bootstrap5';
import { Clock } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Recipes } from '../../api/recipes/Recipes';
import LoadingSpinner from '../components/LoadingSpinner';
import { useStickyState } from '../utilities/StickyState';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
});

function getProfileData(dietaryRestrictions) {
  const data = Recipes.collection.findOne({ dietaryRestrictions });
  const interests = _.pluck(Recipes.collection.find({ recipes: dietaryRestrictions }).fetch(), 'dietaryRestrictions');
  return _.extend({}, data, { interests });
}

/* Component for layout out a Profile Card. */
const MakeCard = ({ recipe }) => (
  <Link to={`/view-recipe/${recipe._id}`} className="recipeLink">
    <Card style={{ width: '18rem' }} className="h-100">
      <Card.Img variant="top" src={recipe.image} style={{ height: '40vh' }} />
      <Card.Title className="px-3">{recipe.name}</Card.Title>
      <Card.Subtitle className="px-3">{recipe.owner}</Card.Subtitle>
      <Card.Body>
        <Card.Text><Clock /> {recipe.time}</Card.Text>
        <Card.Text><Badge bg="info">{recipe.dietaryRestrictions}</Badge></Card.Text>
      </Card.Body>
    </Card>
  </Link>
);

/* Properties */
MakeCard.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    image: PropTypes.string,
    instructions: PropTypes.string,
    time: PropTypes.string,
    servings: PropTypes.number,
    dietaryRestrictions: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/* Renders the Profile Collection as a set of Cards. */
const Filter = () => {
  const [dietaryRestrictions, setInterests] = useStickyState('dietaryRestrictions', []);

  const { ready, interestDocs } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Recipes.userPublicationName);
    return {
      ready: sub1.ready(),
      interestDocs: Recipes.collection.find().fetch(),
    };
  }, []);

  const submit = (data) => {
    setInterests(data.interests || []);
  };

  const allInterests = _.pluck(interestDocs, 'dietaryRestrictions');
  const formSchema = makeSchema(allInterests);
  const bridge = new SimpleSchema2Bridge(formSchema);

  const transform = (label) => ` ${label}`;

  return ready ? (
    <Container id={PageIDs.filterPage} style={pageStyle}>
      <AutoForm schema={bridge} onSubmit={data => submit(data)} model={{ dietaryRestrictions }}>
        <Card>
          <Card.Body id={ComponentIDs.filterFormInterests}>
            <SelectField name="interests" multiple placeholder="Interests" checkboxes transform={transform} />
            <SubmitField id={ComponentIDs.filterFormSubmit} value="Submit" />
          </Card.Body>
        </Card>
      </AutoForm>
      <Row xs={1} md={2} lg={4} className="g-2" style={{ paddingTop: '10px' }}>
        {getProfileData.map((profile, index) => <MakeCard key={index} profile={profile} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Filter;
