/* globals require,module,console */

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var PageSlider = require('./utils/pageslider');
var _ = require('underscore');

Backbone.$ = $;

// Classes
var LoginView = require('./views/Login');
var BookingsView = require('./views/Bookings');
var BookingView = require('./views/Booking');

var loginView = new LoginView();
var BookingsCollection = require('./collections/Bookings');
var BookingModel = require('./models/Booking');
var bookingsCollection = new BookingsCollection();
var slider = new PageSlider($('#main-page-container'), $('#main-navigation-bar'));
var NavigationBarView = require('./views/NavigationBarView');
var navigationBarView = new NavigationBarView();

var router = Backbone.Router.extend({

    currentRoute: undefined,

    initialize: function () {
        this.bind('route', function(page) {

            if (!this.currentRoute || this.currentRoute.route === 'login' || this.currentRoute.route == page) {
                navigationBarView.hideBackButton();
            } else {
                navigationBarView.showBackButton();
            }
            this.currentRoute = this.getCurrentRoute();
        });
    },

    routes: {
        'login': 'login',
        'bookings': 'bookings',
        'bookings/:id': 'booking',
        'bookings/:id/comment': 'bookingCommentModal',
    },

    login: function () {
        slider.slidePage(loginView.$el, { navBar: false });
    },

    bookings: function () {
        console.log('bookings');
        bookingsCollection.fetch({
            success: function () {
                var bookingsView = new BookingsView({ collection : bookingsCollection });
                slider.slidePage(bookingsView.$el);
            }
        });
    },

    booking: function (id) {
        console.log('booking');
        var booking = new BookingModel({ id : id });
        booking.fetch({
            success: function () {
                var bookingView = new BookingView({ model : booking, slider: slider });
                slider.slidePage(bookingView.$el);
            }
        });
    },

    getCurrentRoute : function() {
        var Router = this,
            fragment = Backbone.history.fragment,
            routes = _.pairs(Router.routes),
            route = null, params = null, matched;

        matched = _.find(routes, function(handler) {
            route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
            return route.test(fragment);
        });

        if(matched) {
            // NEW: Extracts the params using the internal
            // function _extractParameters
            params = Router._extractParameters(route, fragment);
            route = matched[1];
        }

        return {
            route : route,
            fragment : fragment,
            params : params
        };
    }

});

module.exports = router;
