var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var url = require('url');
var config = require('../config/config');

var BaseModel = Backbone.Model.extend({
	defaults: {
		path: '/'
	},
	url: function () {
		return url.resolve(config.apiBaseURL, (_.isFunction(this.path) ? this.path() : this.path));
	}
});

module.exports = BaseModel;