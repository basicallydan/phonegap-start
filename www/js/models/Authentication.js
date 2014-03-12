var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var BaseModel = require('./BaseModel');
var url = require('url');
var config = require('../config/config');

module.exports = BaseModel.extend({
    defaults: {
        sessions: {
            email: '',
            password: ''
        }
    },
    // localStorage: new Backbone.LocalStorage('Authentication'),
    url: function () {
        var path = '/login';
        if (this.id) {
            path = '/logout';
        }
        return url.resolve(config.apiBaseURL, path);
    },
    save: function (attributes, opts) {
        var body = {
            sessions: {
                email: attributes.email,
                password: attributes.password
            }
        };
        return BaseModel.prototype.save.call(this, body, opts);
    }
});