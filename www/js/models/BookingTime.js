var BaseModel = require('./BaseModel');
var moment = require('moment');
var config = require('../config/config');

module.exports = BaseModel.extend({
    path: function () {
        return '/bookings/' + this.attributes.sku + '/suggest';
    },
    idAttribute: 'sku',
    initialize: function (dateTime, options) {
        this.attributes.dateTime = dateTime;
        this.attributes.id = options.id;
        this.attributes.sku = options.sku;
    },
    getDateTime: function () {
        if (this.attributes.dateTime) {
            return this.attributes.dateTime;
        }
        return undefined;
    },
    setDateTime: function (d) {
        this.attributes.dateTime = d;
    },
    toJSON: function () {
        return {
            // booking_date: this.attributes.dateTime // Format may need to be'Fri+Mar+14+2014+00%3A00%3A00'
            booking_date: moment(this.attributes.dateTime, config.incomingDateFormat).format('ddd MMM D YYYY HH:mm:ss')
        };
    }
});