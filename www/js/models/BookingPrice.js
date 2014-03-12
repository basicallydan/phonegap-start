var BaseModel = require('./BaseModel');
var moment = require('moment');
var config = require('../config/config');

module.exports = BaseModel.extend({
    path: function () {
        return '/bookings/' + this.attributes.sku + '/make_offer';
    },
    idAttribute: 'sku',
    initialize: function (price, options) {
        this.attributes.price = price;
        this.attributes.id = options.id;
        this.attributes.sku = options.sku;
    },
    getPrice: function () {
        if (this.attributes.price) {
            return this.attributes.price;
        }
        return undefined;
    },
    setPrice: function (d) {
        this.attributes.price = d;
    },
    toJSON: function () {
        return {
            // booking_date: this.attributes.dateTime // Format may need to be'Fri+Mar+14+2014+00%3A00%3A00'
            booking: {
                new_offer: this.attributes.price
            }
        };
    }
});