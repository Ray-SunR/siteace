Accounts.ui.config({
  requestPermissions: {},
  extraSignupFields: [{
  	fieldName: 'Username',
  	fieldLabel: 'Username',
  	inputType: 'text',
  	visible: true,
  	validate: function(value, errorFunction){
  		if (!Meteor.users.findOne({username: value})){
  			return true;
  		}
  		else{
  			errorFunction("This username has already been used, please enter another one");
  			return false;
  		}
  	}
  }]
});