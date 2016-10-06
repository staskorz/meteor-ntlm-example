import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import ntlmLogin from '/imports/client/ntlm-auth/login';


ntlmLogin(err => {
	// uncomment the following line for troubleshooting
	// console.log('NTLM login error:', err);
});


import './main.html';

Template.hello.onCreated(function helloOnCreated() {
	// counter starts at 0
	this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
	counter() {
		return Template.instance().counter.get();
	},
});

Template.hello.events({
	'click button'(event, instance) {
		// increment the counter when button is clicked
		instance.counter.set(instance.counter.get() + 1);
	},
});


Template.ntlmUser.helpers({
	user() {
		return Meteor.user();
	},
});
