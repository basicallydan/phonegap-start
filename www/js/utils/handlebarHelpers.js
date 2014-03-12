var Handlebars = require('hbsfy/runtime');
var moment = require('moment');
var config = require('../config/config');
var padInteger = require('./padInteger');

Handlebars.registerHelper('bookingDetailsPriceText', function() {
	if (this.price_in_units && this.price_in_units.booking) {
		return new Handlebars.SafeString(config.currencySymbolMap[this.currency] + (this.price_in_units.booking.new_offer / 100));
	} else {
		return new Handlebars.SafeString('Suggest a price');
	}
});

Handlebars.registerHelper('bookingListTimeText', function() {
	if (this.starts_on && this.starts_on.booking_date) {
		return new Handlebars.SafeString(moment(this.starts_on.booking_date, config.incomingDateFormat).format('Do MMMM YYYY [at] h:mm'));
	} else {
		return '';
	}
});

Handlebars.registerHelper('bookingDetailsTimeText', function() {
	if (this.starts_on && this.starts_on.booking_date) {
		return new Handlebars.SafeString(moment(this.starts_on.booking_date, config.incomingDateFormat).format('MMMM Do [@] h:mm'));
	} else {
		return new Handlebars.SafeString('Suggest a time & date');
	}
});

function selectWithNumbers(min, max) {
	var current;
	var placeholder;
	if (typeof max === 'string') {
		placeholder = max;
	}
	if (!max || isNaN(max)) {
		max = min;
		min = 0;
	}
	var out = '<select>\n';
	if (placeholder) {
		out += '<option selected="selected">' + placeholder + '</option>\n'
	}
	for (current = min; current <= max; current++) {
		out += '<option value="' + current + '">' + padInteger(current) + '</option>\n';
	}
	out += '</select>\n';
	return out;
}

Handlebars.registerHelper('timeSelect', function() {
	var out = selectWithNumbers(23, 'Hour');
	out += selectWithNumbers(59, 'Minute');
	return out;
});