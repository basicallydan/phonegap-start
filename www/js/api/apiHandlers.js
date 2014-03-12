// Contains some helper methods for making API Requests and also handles errors, etc

var url = require('url');
$ = require('jquery');
var config = require('../config/config.js');
var _ = require('underscore');

$.ajaxSetup({
	beforeSend: function (xhr) {
		var authHash = window.btoa(config.apiAuthToken);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Authorization', 'Basic ' + authHash);
	},
	statusCode: {
		401: function (data) {
			alert('401 Unauthorized:', data);
		},
		403: function (data) {
			alert('403 Forbidden:', data);
		}
	}
});

function postRequest(p, body, opts) {
	var ajaxOpts = {
        url: url.resolve(config.apiBaseURL, p),
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(body)
    };
	return $.ajax(_.defaults(ajaxOpts, opts));
}

function deleteRequest(p, opts) {
	var ajaxOpts = {
        url: url.resolve(config.apiBaseURL, p),
        type: 'DELETE'
    };
	return $.ajax(_.defaults(ajaxOpts, opts));
}

module.exports = {
	post: postRequest,
	delete: deleteRequest
};