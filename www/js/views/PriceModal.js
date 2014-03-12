var ModalView = require('./ModalView');
var _ = require('underscore');

module.exports = ModalView.extend({
	contentTemplate: require('../templates/PriceModal.hbs'),

	events: function(){
		return _.extend({}, ModalView.prototype.events,{
			'click .btn-suggest-price': 'suggestPrice',
			'keyup .suggested-price': 'checkForm'
		});
	},

	initialize: function (options) {
		if (options.price) {
			// Assume price is given in the lowest denomination, e.g. pence
			this.suggestedPriceText = options.price / 100;
			this.startingPrice = options.price;
		}
		if (options.currency) {
			this.currencySymbol = options.currency.toLowerCase === 'gbp' ? '£' : '€';
		}
		this.setTitle('Suggest a price');
		this.render();
		this.checkForm();
	},

	suggestPrice: function (e) {
		e.preventDefault();
		if (this.startingPrice !== this.newPrice()) {
			this.trigger('price-changed', this.newPrice());
		} else {
			this.trigger('close');
		}
	},

	// Returns in lowest denom.
	newPrice: function () { return (+this.$el.find('.suggested-price').val()) * 100; },

	priceHasChanged: function () {
		return this.startingPrice !== this.newPrice();
	},

	checkForm: function (e) {
		if (this.$el.find('.suggested-price').val().trim() && this.priceHasChanged()) {
			this.$el.find('.btn-suggest-price').removeAttr('disabled');
		} else {
			this.$el.find('.btn-suggest-price').attr('disabled', 'disabled');
		}
	}
});