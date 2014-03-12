var ModalView = require('./ModalView');
var _ = require('underscore');
var Pikaday = require('pikaday');
var config = require('../config/config');
var padInteger = require('../utils/padInteger');
var isNumber = require('../utils/isNumber');
var moment = require('moment');

module.exports = ModalView.extend({
	contentTemplate: require('../templates/DatePickerModal.hbs'),

	originalDate: undefined,

	events: function(){
		return _.extend({}, ModalView.prototype.events,{
			'click .btn-pick-datetime': 'submit',
			'change #time-picker-container select': 'validate',
		});
	},

	initialize: function (options) {
		// Set properties
		this.setTitle('Suggest a date');

		this.render();

		// Initialize the elements
		this.hourSelect = this.$el.find('#time-picker-container select:nth-child(1)');
		this.minuteSelect = this.$el.find('#time-picker-container select:nth-child(2)');
		this.picker = new Pikaday({
			onSelect: function() {
				this.validate();
			}.bind(this)
		});

		if (options.date) {
			this.originalDate = options.date;
			this.picker.setDate(options.date);
		}

		this.$el.find('#date-picker-container').html(this.picker.el);


		if (this.originalDate) {
			this.hourSelect.val(moment(this.originalDate, config.incomingDateFormat).hour());
			this.minuteSelect.val(moment(this.originalDate, config.incomingDateFormat).minute());
		}

		this.picker.show();
		this.validate();
	},

	getSelectedMoment: function () {
		var selectedMoment = this.picker.getMoment();
		if (isNumber(this.hourSelect.val())) {
			selectedMoment.hour(+this.hourSelect.val());
		}
		if (isNumber(this.minuteSelect.val())) {
			selectedMoment.minute(+this.minuteSelect.val());
		}
		return selectedMoment;
	},

	dateHasChanged: function () {
		return !moment(this.originalDate, config.incomingDateFormat).isSame(this.getSelectedMoment());
	},

	submit: function (e) {
		e.preventDefault();
		if (this.validate()) {
			this.trigger('date-changed', this.getSelectedMoment().format(config.incomingDateFormat));
		}
	},

	validate: function () {
		if (this.dateHasChanged()) {
			this.$el.find('.btn-pick-datetime').removeAttr('disabled');
			return true;
		} else {
			this.$el.find('.btn-pick-datetime').attr('disabled', 'disabled');
			return false;
		}
	}
});