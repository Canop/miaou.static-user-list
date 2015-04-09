
// This plugin checks the user is in a whitelist of users defined by
//  an oauthprovider and an email, all of them being defined
//  in a users.csv file
// Implementation note : the whitelisted state isn't stored in the
//  req.user object to ensure a simple restart forces the check again
//  whatever other application caches (which might be out of process)

var	userfilepath,
	path = require('path'),
	fs = require('fs'),
	whitelist;

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
	if (!whitelist) return fail(req, res, "Invalid user list. All users are rejected.");
	if (!whitelist.has(provider+' '+email)) return fail(req, res, "User not found in white list");
	next();
}

exports.init = function(miaou, pluginpath){
	fs.readFile(path.resolve(pluginpath, 'users.csv'), function(err, data) {
		if (err) {
			console.error("User list could not be open, all users will be rejected");
			return;
		}
		whitelist = new Set();
		for (var line of data.toString().split("\n")) {
			var tokens = line.split(/[,;]/);
			if (tokens.length>=2) whitelist.add(tokens[0].trim()+' '+tokens[1].trim());
		}
		console.log("Static User List initialized : " + whitelist.size + " authorized users.");
	});
}
