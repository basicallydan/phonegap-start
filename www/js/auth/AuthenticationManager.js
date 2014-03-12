var apiHandlers = require('../api/apiHandlers');
var _ = require('underscore');

function AuthenticationManager() {
	this.username = localStorage.getItem('username');
}

AuthenticationManager.prototype.login = function (username, password, opts) {
	opts = opts || {};
	apiHandlers.post('/sessions', {
		sessions: {
			email: username,
			password: password
		}
	}, {
		localCache: false,
		success: function () {
			this.username = username;
			localStorage.setItem('username', username);
			if (opts.success) {
				opts.success();
			}
		}.bind(this),
		error: function () {
			if (opts.error) {
				opts.error();
			}
		}
	});
};

AuthenticationManager.prototype.logout = function () {
	this.username = undefined;
	localStorage.clear();
	apiHandlers.delete('/sessions');
};

AuthenticationManager.prototype.loggedIn = function () {
	return !!this.username;
};

module.exports = AuthenticationManager;
