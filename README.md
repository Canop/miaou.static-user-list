# miaou.static-user-list

A Miaou plugin to filter users using a whitelist.

## Goal

When your Miaou server is dedicated to a very small community, you might prefer to filter accesses to the whole server instead of having to set up authorizations on a per room basis.

This plugin doesn't replace the OAUth authentication step. It filters users, letting in the ones whose OAuth provider and email match a couple defined in the users.csv file.

## How to use it

### Set up the users file

Rename the `example-users.csv` file to `users.csv` and then fill it.

A line must contain both the OAuth provider code (for example github) and the email.

Users not found in the file won't be able to log in (even if they could log in before).

### Register the plugin

Edit Miaou's `config.json` file to register the plugin with its relative path.
	
This might be

	"plugins": [
		"./plugins/miaou.static-user-list/plugin.js"
	],

## Changes to the list

Each time the `users.csv` file is modified, Miaou must be restarted to take that change into account.

This is usually done with

	./restart.sh
	
in the Miaou directory
