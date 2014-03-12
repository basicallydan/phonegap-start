var $ = require('jquery');
require('../vendor/jquery.plugin.pullToRefresh.js');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var network = require('../utils/network');
var template = require('../templates/Bookings.hbs');
var listPartialTemplate = require('../templates/_BookingsList.hbs');
var PullToRefreshList = require('../utils/pullToRefresh');
var retina = window.devicePixelRatio > 1;
require('../vendor/requestAnimationFrame');
require('../vendor/jquery.plugin.pullToRefresh');

// Backbone.$ = $;

module.exports = Backbone.View.extend({

    currentView: 'upcoming',

    initialize: function() {
        this.render();
        this.upcomingRadioButton = this.$el.find('#radio-upcoming');
        this.pastRadioButton = this.$el.find('#radio-past');
        this.$el.on('click', '.settings-button', function(event) {
            event.preventDefault();
            this.$el.find('#bookings-view-options').toggleClass('visible');
        }.bind(this));
        this.$el.on('change', '#radio-upcoming, #radio-past', function(event) {
            if (this.upcomingRadioButton.is(':checked')) {
                this.currentView = 'upcoming';
            } else if (this.pastRadioButton.is(':checked')) {
                this.currentView = 'past';
            }
            this.updateView();
        }.bind(this));
        setTimeout(function() {
            $('.bookings-list-container').pullToRefresh({
                callback: function() {
                    var def = $.Deferred();

                    this.updateView(function () {
                        def.resolve();
                    });

                    return def.promise();
                }.bind(this)
            });
            // var list = new PullToRefreshList('.bookings-list-container', {
            //     maxHeight: 50,
            //     triggerHeight: 40,
            //     messageContent: '<img src="http://lorempixel.com/360/50" />',
            //     onTrigger: function() {
            //         setTimeout(function() {
            //             this.updateView(function () {
            //                 list.close();
            //             });
            //         }.bind(this), 800);
            //     }.bind(this)
            // });
        }.bind(this), 100);
    },

    render: function() {
        var listViewRendered = listPartialTemplate(this.collection.viewModel());
        this.$el.html(template());
        this.$el.find('.bookings-list').html(listViewRendered);
        return this;
    },

    updateView: function(then) {
        this.collection.fetch({
            data: $.param({
                view: this.currentView
            }),
            isCacheValid: network.isOffline,
            success: function(jqXHR, status) {
                var listViewRendered = listPartialTemplate(this.collection.viewModel());
                console.log('Updating. Status', status);
                this.$el.find('.bookings-list').html(listViewRendered);
                if (then) {
                    then();
                }
            }.bind(this),
            error: function() {
                then();
            }
        });
    }
});