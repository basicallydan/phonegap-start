var Backbone = require('backbone');
Backbone.$ = $;
var modalFrameTemplate = require('../templates/ModalFrame.hbs');

module.exports = Backbone.View.extend({
	events: {
		'click .close-button': 'closeButtonClicked'
	},

	setTitle: function (title) {
		this.title = title;
	},

	render: function () {
		this.$el.html(modalFrameTemplate({ title : this.title || '' }));
		if (this.contentTemplate) {
			this.$el.find('#modal-page-container').html(this.contentTemplate(this));
		}
		return this;
	},

	close: function () {
		this.trigger('close');
	},

	closeButtonClicked: function (e) {
		e.preventDefault();
		this.close();
	}
});