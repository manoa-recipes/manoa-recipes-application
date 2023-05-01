import { Meteor } from 'meteor/meteor';
import { loadDefaultData } from '../both/CollectionHelpers';

/* eslint-disable no-console */
/** For Debugging */
const verbose = true;
if (verbose) { console.log('Mongo.js running...\n  verbose is enabled\n'); }
/** Expression to populate the collections with default data. */
if (Meteor.users.find().count() === 0) { loadDefaultData(); }
