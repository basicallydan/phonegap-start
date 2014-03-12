var ModalView = require('./ModalView');
var _ = require('underscore');

module.exports = ModalView.extend({
	contentTemplate: require('../templates/CommentModal.hbs'),

	events: function(){
		return _.extend({}, ModalView.prototype.events,{
			'click .btn-add-comment': 'addComment',
			'keyup .comment-text': 'checkForm'
		});
	},

	initialize: function () {
		this.setTitle('Add a comment');
		this.render();
		this.checkForm();
	},

	addComment: function (e) {
		e.preventDefault();
		this.trigger('comment-added', this.$el.find('.comment-text').val());
		console.log('Adding comment', this.$el.find('.comment-text').val());
	},

	checkForm: function (e) {
		if (this.$el.find('.comment-text').val().trim()) {
			this.$el.find('.btn-add-comment').removeAttr('disabled');
		} else {
			this.$el.find('.btn-add-comment').attr('disabled', 'disabled');
		}
	}
});