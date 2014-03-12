var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var url = require('url');
var config = require('../config/config.js');

var BaseCollection = Backbone.Collection.extend({
    url: function () {
		return url.resolve(config.apiBaseURL, (_.isFunction(this.path) ? this.path() : this.path));
    }
});

module.exports = BaseCollection;