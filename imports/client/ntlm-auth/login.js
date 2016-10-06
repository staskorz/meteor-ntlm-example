import { Accounts } from 'meteor/accounts-base';


export default userCallback => {
	const loginRequest = {
		ntlm: true
	};
	
	Accounts.callLoginMethod({
		methodArguments: [loginRequest],
		userCallback
	});
};
