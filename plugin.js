
// This plugin checks the user is in a whitelist of users defined by
//  and oauthprovider and an email, all of them being defined
//  in a users.csv file
// This plugin is dedicated to servers whose user base should not be
//  massive, and thus it's assumed it's not a problem to read the whole
//  user list each time a user logs in.

var	userfilepath,
	path = require('path'),
	fs = require('fs');

function fail(req, res, message){
	console.log("Access forbidden for user "+req.user.name, message);
	res.status(401).send(message);	
}

exports.appuse = function(req, res, next){
	if (!req.isAuthenticated()) return next();
	var	provider = req.user.oauthprovider,
		email = req.user.email;
	if (!provider) return fail(req, res, "Inconsistent user state : no OAuth provider.");
	if (!email) return fail(req, res, "Authenticated user is missing the email field.");
	fs.readFile(userfilepath, function(err, data) {
		if (err) return fail(req, res, "User list could not be open, user authorization not verifiable");
		for (var line of data.toString().split("\n")) {
			var tokens = line.split(/[,;]/);
			if (tokens.length>=2 && provider===tokens[0].trim() && email===tokens[1].trim()) {
				console.log("User "+req.user.name+" can enter");
				return next();
			}
		}
		fail(req, res, "User "+req.user.name+" not found in white list")
	});	
}

exports.init = function(miaou, pluginpath){
	userfilepath = path.resolve(pluginpath, 'users.csv');
}
