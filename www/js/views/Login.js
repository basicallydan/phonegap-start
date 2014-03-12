var Backbone = require('backbone'),
    $ = require('jquery'),
    template = require('../templates/Login.hbs'),
    api = require('../api/apiHandlers'),
    AuthenticationManager = require('../auth/AuthenticationManager');
require('../vendor/jquery.powertip.js');

// Backbone.$ = $;

module.exports = Backbone.View.extend({

    authenticationManager: new AuthenticationManager(),

    initialize: function () {
        this.render();
        this.$el.find('.login-form .email, .login-form .password').val('');
    },

    getEmail: function () {
        if (!this.$el) return null;
        return this.$el.find('.login-form .email').val();
    },

    getPassword: function () {
        if (!this.$el) return null;
        return this.$el.find('.login-form .password').val();
    },

    events: {
        'submit .login-form': 'login'
    },

    render: function () {
        this.$el.html(template());
        return this;
    },

    hideErrors:function () {
        this.$el.find('.login-form .email').powerTip('destroy');
    },

    login: function (e) {
        e.preventDefault();
        console.log('Logging in...');

        this.hideErrors();
        this.authenticationManager.login(this.getEmail(), this.getPassword(), {
            success: function () {
                // alert('Logged in!');
                Backbone.history.navigate('#bookings', {trigger: true});
            }.bind(this),
            error: function () {
                // var popover = new Popover('Nope, you suck');
                // popover.show(this.$el);
                $('.email').attr('title', 'The username/password is incorrect. Please try again.').powerTip({
                    placement:'n',
                    manual:true,
                    offset:25
                }).powerTip('show');

                this.$el.find('.login-form .email, .login-form .password').keydown(function () {
                    this.hideErrors();
                }.bind(this));
                // alert('The username/password is incorrect. Please try again.');
            }.bind(this)
        });
    }
});