var $ = require('jquery');
require('../vendor/jquery.plugin.pullToRefresh.js');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var network = require('../utils/network');
var template = require('../templates/Booking.hbs');
var commentPartialTemplate = require('../templates/_Comment.hbs');
var _ = require('underscore');
var retina = window.devicePixelRatio > 1;

// Classes
var CommentModal = require('./CommentModal');
var PriceModal = require('./PriceModal');
var DatePickerModal = require('./DatePickerModal');

// Backbone.$ = $;

module.exports = Backbone.View.extend({

	initialize: function (opts) {
		if (opts.slider) {
			this.slider = opts.slider;
		}

		this.allCommentsVisible = false;

		this.render();
	},

	events: {
		'click .comments-button': 'addComment',
		'click .time-button': 'pickDate',
		'click .price-button': 'suggestPrice',
		'click #toggle-all-comments': 'toggleAllComments'
	},

	render: function () {
		var viewModel = this.model.viewModel();
		var commentsList = _.reduce(viewModel.booking.comments, function (html, comment) { return html += commentPartialTemplate(comment); }, '');
		this.$el.html(template(viewModel));
		this.$el.find('.comments-list').html(commentsList);
		if (this.allCommentsVisible) {
			this.$el.find('.comments-list').removeClass('comments-list--latest');
			this.$el.find('.toggle-all').toggleClass('toggle-all--visible');
		}
		var numberOfHiddenComments = viewModel.booking.comments.length - 2;

		if (numberOfHiddenComments <= 0) {
			this.$el.find('.toggle-all').hide();
		} else {
			this.$el.find('.toggle-all .num-remaining-comments').text(numberOfHiddenComments);
		}

		return this;
	},

	updateView: function() {
		this.model.fetch({
			success: function(jqXHR, status) {
				this.render();
			}.bind(this)
		});
	},

	toggleAllComments: function (e) {
		e.preventDefault();
		this.$el.find('.comments-list').toggleClass('comments-list--latest');
		this.$el.find('.toggle-all').toggleClass('toggle-all--visible');
		this.allCommentsVisible = !this.$el.find('.comments-list').hasClass('comments-list--latest');
	},

	addComment: function (e) {
		e.preventDefault();
		var commentModal = new CommentModal();
		this.slider.slideModal(commentModal);

		commentModal.on('comment-added', function (comment) {
			commentModal.close();
			this.model.attributes.booking.comments.create(
				{
					booking_comment: {
						body: comment
					}
				},
				{
					success: function () {
						console.log('Saved new comment');
						this.updateView();
					}.bind(this)
				});
			// console.log('New comment:', comment);
		}.bind(this));
	},

	pickDate: function (e) {
		e.preventDefault();
		var datePickerModal = new DatePickerModal({ date: this.model.attributes.booking.starts_on.getDateTime() });
		this.slider.slideModal(datePickerModal);

		datePickerModal.on('date-changed', function (newDate) {
			datePickerModal.close();
			this.model.attributes.booking.starts_on.setDateTime(newDate);
			this.model.attributes.booking.starts_on.save(null, {
				success: function () {
					console.log('Saved new date');
					this.updateView();
				}.bind(this)
			});
		}.bind(this));
	},

	suggestPrice: function (e) {
		e.preventDefault();
		var priceModal = new PriceModal({ price : this.model.attributes.booking.price_in_units.getPrice(), currency: this.model.attributes.booking.currency });
		this.slider.slideModal(priceModal);

		priceModal.on('price-changed', function (newPrice) {
			priceModal.close();
			this.model.attributes.booking.price_in_units.setPrice(newPrice);
			this.model.attributes.booking.price_in_units.save(null, {
				success: function () {
					console.log('Saved new price');
					this.updateView();
				}.bind(this)
			});
			// console.log('New price:', newPrice);
		}.bind(this));
	}
});