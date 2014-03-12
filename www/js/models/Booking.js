var BaseModel = require('./BaseModel');
var moment = require('moment');
var _ = require('underscore');
var config = require('../config/config');
var BookingCommentCollection = require('../collections/BookingComments');
var BookingTime = require('../models/BookingTime');
var BookingPrice = require('../models/BookingPrice');

var createCommentViewModel = function (comment, booking) {
    var commentVm = _.clone(comment);
    commentVm.currentUser = commentVm.from === 'instructor';
    commentVm.formattedDate = moment(commentVm.created_at, config.incomingDateFormat).fromNow();
    if (commentVm.from === 'instructor') {
        commentVm.avatar = booking.instructor.avatar;
    } else {
        commentVm.avatar = booking.attendee.avatar;
    }
    commentVm.cssClass = '';
    switch (commentVm.action) {
        case null:
        case 'message':
            commentVm.text = commentVm.body;
            break;
        case 'instructor_changes_time':
            commentVm.text = 'Booking time changed';
            commentVm.cssClass = 'commentVm-action';
            break;
        case 'instructor_makes_offer':
            commentVm.text = 'Booking price changed';
            commentVm.cssClass = 'commentVm-action';
            break;
        case 'instructor_confirms':
            commentVm.text = 'Confirmed by instructor';
            commentVm.cssClass = 'commentVm-action';
            break;
        case 'user_confirms':
            commentVm.text = 'Confirmed by user';
            commentVm.cssClass = 'commentVm-action';
            break;
        default:
            commentVm.text = commentVm.action;
            break;
    }

    return commentVm;
};

module.exports = BaseModel.extend({
    path: function () {
        return '/bookings/' + this.id;
    },

    collections: {
        comments: BookingCommentCollection
    },

    models: {
        starts_on: BookingTime,
        price_in_units: BookingPrice
    },

    parse: function (response) {
        for(var cKey in this.collections)
        {
            if (response.booking[cKey]) {
                var embeddedClass = this.collections[cKey];
                var embeddedData = response.booking[cKey];
                response.booking[cKey] = new embeddedClass(embeddedData, {parse:true, sku: response.booking.sku, id: response.booking.id});
            }
        }

        for(var mKey in this.models)
        {
            if (response.booking[mKey]) {
                var embeddedClass = this.models[mKey];
                var embeddedData = response.booking[mKey];
                response.booking[mKey] = new embeddedClass(embeddedData, {parse:true, sku: response.booking.sku, id: response.booking.id});
            }
        }

        if (!response.booking.starts_on) {
            response.booking.starts_on = new BookingTime(null, {parse:true, sku: response.booking.sku, id: response.booking.id});
        }

        if (!response.booking.price_in_units) {
            response.booking.price_in_units = new BookingPrice(null, {parse:true, sku: response.booking.sku, id: response.booking.id});
        }

        return response;
    },

    viewModel: function (options) {
        var vm = JSON.stringify(this.toJSON(options));
        vm = JSON.parse(vm);

        if (this.attributes.booking.starts_on) {
            vm.booking.starts_on.booking_date = this.attributes.booking.starts_on.attributes.dateTime;
        }

        if (vm.booking.state === 'confirmed') {
            vm.booking.confirmed = true;
        } else {
            vm.booking.confirmed = false;
        }

        // if (vm.booking.price_in_units) {
        //     vm.booking.formattedPrice = config.currencySymbolMap[vm.booking.currency] + (vm.booking.price_in_units / 100);
        // }

        if (vm.booking.comments) {
            // var c = _.map(vm.booking.comments, createCommentViewModel);
            vm.booking.comments = _.map(vm.booking.comments, function(c) { return createCommentViewModel(c, vm.booking); }).reverse();

            if (vm.booking.comments.length > 0) {
                vm.booking.allCommentsVisible = false;
            }
        }

        return vm;
    }
});