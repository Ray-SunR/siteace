Template.registerHelper("Func_Hide_Comments", function(){
return Session.get("current_route") == "home";
});

Template.registerHelper("Func_Hide_Details", function(){
return Session.get("current_route") == "details";
});

function FixObjKeys(obj){
  var ret = {};
  for (key in obj){
    var key2 = key.replace(/\-/g, '_');
    ret[key2] = obj[key];
  }
  return ret;
}

Template.website_item.rendered = function(){
if (Session.get("current_route") == "details"){
	$("detail-button").addClass("hidden");
}
else if (Session.get("current_route") == "home"){
	$("#comments").addClass("hidden");
}
};

/////
// template helpers 
/////
// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort: {upvotes: -1}});
	}
});


/////
// template events 
/////

Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)

		Meteor.call("UpVoteWebsite", this._id, Meteor.userId());
		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		Meteor.call("DownVoteWebsite", this._id, Meteor.userId());
		return false;// prevent the button from reloading the page
	}
});

Template.comment_input.events({
	"click .js-comment": function(event){
		var comments = $('#comment_input').val();
		Meteor.call("AddCommentToWebsite", this._id, Meteor.userId(), comments);
		$('#comment_input').val('');
	}
});

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}, 
	"submit .js-save-website-form":function(event){

		// here is an example of how to get the url out of the form:
		var url = event.target.url.value;
		var title = event.target.title.value;
		var desc = event.target.description.value;

		Meteor.call("AddNewWebsite", url, title, desc, Meteor.userId());
		return false;// stop the form submit from reloading the page
	}
});
