import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { headers } from 'meteor/gadicohen:headers';


Meteor.methods({
	getNtlmUser() {
		// headers.get() can only run from within
		// a Meteor method or a publication
		return headers.get(this, 'x-ntlm-user');
	}
});


// Heavily inspired by https://meteorhacks.com/extending-meteor-accounts/
Accounts.registerLoginHandler('ntlm', ({ ntlm }) => {
	if(!ntlm) {
		return undefined;
	}
	
	const username = Meteor.call('getNtlmUser');
	
	if(!username) {
		return {
			type: 'ntlm',
			error: new Meteor.Error('ntlm.loginHandler.undeterminedUser', 'Could not determine NTLM user')
		};
	}
	
	const user = Meteor.users.findOne({ username }, { fields: { _id: 1 } });
	
	let userId;
	
	if(user) {
		userId = user._id;
	} else {
		userId = Meteor.users.insert({ username });
	}
	
	return {
		userId
	};
});
