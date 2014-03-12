var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var BaseCollection = require('./BaseCollection');
var Booking = require('../models/Booking');

module.exports = BaseCollection.extend({
    model: Booking,
    // localStorage: new Backbone.LocalStorage('Bookings'),
    path:'/bookings',
    viewModel: function(options) {
        return this.map(function(model){ return model.viewModel(options); });
    }
});