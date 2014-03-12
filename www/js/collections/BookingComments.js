var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var BaseCollection = require('./BaseCollection');
// var Booking = require('../models/BookingComment');

module.exports = BaseCollection.extend({
	// model: BookingComment,
	// localStorage: new Backbone.LocalStorage('Bookings'),
	initialize: function (models, options) {
		this.sku = options.sku;
	},
	path: function () {
		return '/bookings/' + this.sku + '/booking_comments';
	}
});