import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
  'tasks.addUserToRole'({ userId, role }) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Roles.createRole(role, { unlessExists: true });
    console.log('Roles.createRole worked');
    Roles.addUsersToRoles(userId, role);
    console.log('Roles.addUsersToRoles worked');

  },
});
