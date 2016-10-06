import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import ntlmLogin from '/imports/client/ntlm-auth/login';


ntlmLogin(err => {
	// uncomment the following line for troubleshooting
	// console.log('NTLM login error:', err);
});


import './main.html';


Template.ntlmUser.helpers({
	user() {
		return Meteor.user();
	},
});
