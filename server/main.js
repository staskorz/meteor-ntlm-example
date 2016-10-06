import { Meteor } from 'meteor/meteor';

import '/imports/server/ntlm-auth/proxy';
import '/imports/server/ntlm-auth/register-login-handler';


Meteor.startup(() => {
  // code to run on server at startup
});
