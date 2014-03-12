var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var router = require('../router');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.$el = $('.topcoat-navigation-bar');
    },

    events: {
        'click .back-button': 'back'
    },

    showBackButton: function () {
        this.$el.find('.back-button').css({ opacity: 1.0 });
    },

    hideBackButton: function () {
        this.$el.find('.back-button').css({ opacity: 0 });
    },

    back: function (e) {
        e.preventDefault();
        window.history.back();
    }
});