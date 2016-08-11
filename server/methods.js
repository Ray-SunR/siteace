Meteor.methods({
	'AddNewWebsite': function(url, title, desc, user_id){
		if (!Meteor.userId() != user_id){
			return false;
		}
		console.log("AddNewWebsite");
		check(url, String);
		check(title, String);
		check(desc, String);
		check(user_id, String);

		if (!url.startsWith("http") && !url.startsWith("https")){
			url = "http://" + url;
		}

		auto_ret = {};
		extractMeta(url, function(err, ret){
			console.log(ret);
			auto_ret = ret;
			if (!title){
				title = auto_ret.title;
			}

			if (!desc){
				desc = auto_ret.description;
			}

			console.log("url: " + url + " ,title: " + title + " ,description: " + desc);
			Websites.insert({url: url, title: title, description: desc, createdOn: new Date()});
		});

		website.createdOn = new Date();
		Websites.insert(website);
	},
	'AddCommentToWebsite': function(web_id, user_id, comment){
		if (!Meteor.user()){
			return false;
		}
		console.log("AddCommentToWebsite, comment: " + comment);
		check(web_id, String);
		check(user_id, String);
		check(comment, String);
		var comment_obj = {
			user_id: user_id,
			user_name: Meteor.user().profile.Username,
			posted_on: new Date(),
			user_comment: comment
		};

		Websites.update({_id: web_id}, {$push:{comments:comment_obj}});
	},
	'UpVoteWebsite': function(web_id, user_id){
		if (!Meteor.user()){
			return false;
		}
		console.log("UpVoteWebsite, web_id: " + web_id + " user_id: " + user_id);
		check(web_id, String);
		check(user_id, String);
		var website = Websites.findOne({_id: web_id});

		// If this user already voted
		if (_.contains(website.upvoteUsers, user_id)){
			return false;
		}

		// If this user already voted for downvote, remove it from
		// downvoteUsers
		if (_.contains(website.downvoteUsers, user_id)){
			website.downvoteUsers = _.without(website.downvoteUsers, user_id);
		}

		var upvotes = website.upvoteUsers.length + 1;
		var downvotes = website.downvoteUsers.length;

		Websites.update({_id: web_id}, {
			$set: {
				upvotes: upvotes, 
				downvotes: downvotes
			},
			$pull:{
			 	downvoteUsers: user_id
			},
			$push:{upvoteUsers: user_id}
		});
		Users.update(
			{_id: user_id}, 
			{$push:{upvoteWebsite: web_id},
			 $pull:{downvoteUsers: web_id}},
			  {multi: true});
		return true;
	},
	'DownVoteWebsite': function(web_id, user_id){
		if (!Meteor.user()){
			return false;
		}
		console.log("DownVoteWebsite, web_id: " + web_id + " user_id: " + user_id);
		check(web_id, String);
		check(user_id, String);
		var website = Websites.findOne({_id: web_id});

		// If this user already voted
		if (_.contains(website.downvoteUsers, user_id)){
			return false;
		}

		// If this user already voted for downvote, remove it from
		// downvoteUsers
		if (_.contains(website.upvoteUsers, user_id)){
			website.upvoteUsers = _.without(website.upvoteUsers, user_id);
		}

		var upvotes = website.upvoteUsers.length;
		var downvotes = website.downvoteUsers.length + 1;

		Websites.update({_id: web_id}, {
			$set: {
				upvotes: upvotes,
				downvotes: downvotes,
			},
			$pull: {
				upvoteUsers: user_id
			},
			$push:{downvoteUsers: user_id}
		});
		Users.update({_id: user_id}, {
			$push: {
				downvoteWebsite: web_id
			}, 
		  $pull: {
		  	UpVoteWebsite: web_id
		  }},{multi: true});
		return true;
	}
});