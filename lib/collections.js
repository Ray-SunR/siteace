Websites = new Mongo.Collection("websites");
Users = Meteor.users;

Websites.allow({
	insert: function(){return false},
	update: function(){return false},
	remove: function(){return false}
});

Websites.deny({
	insert: function(){return true},
	update: function(){return true},
	remove: function(){return true}
});

Users.allow({
	insert: function(){return false},
	update: function(){return false},
	remove: function(){return false}
});

Users.deny({
	insert: function(){return true},
	update: function(){return true},
	remove: function(){return true}
});
