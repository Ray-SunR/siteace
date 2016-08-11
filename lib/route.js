Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route("/", {
	name: 'home',
	action: function(){
		this.render("navbar", {
			to: "navbar"
		});
		this.render("main", {
			to: "main"
		});
	}
});

Router.route('/details/:_id', {
	name: 'details',
	action: function(){
		this.render("navbar", {
			to: "navbar"
		});
		this.render("single_website", {
			to: "main",
			data: function(){
				return Websites.findOne({_id: this.params._id});
			}
		});
	}});

Router.onBeforeAction(function(){
	console.log("onBeforeAction");
	this.next();
});
	
Router.onAfterAction(function(){
	Session.set("current_route", "details");
}, {only:['details']});

Router.onAfterAction(function(){
		Session.set("current_route", "home");
}, {only:['home']});