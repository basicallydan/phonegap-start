var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var _ = require('underscore');
var url = require('url');
var cookie = require('cookie-cutter');
var AuthenticationModel = require('./models/Authentication');
var AuthenticationManager = require('./auth/AuthenticationManager');
var loggedInIdManager = require('./utils/loggedInIdManager');
var loggedInId = loggedInIdManager.get();
var pushNotifications = require('./utils/pushNotifications');
require('./vendor/jquery-ajax-localstorage-cache');
var config = require('./config/config.js');
var backgroundService;
var authentication;
var network = require('./utils/network');
require('./utils/handlebarHelpers');

// Backbone.sync = doubleSync;

$.ajaxSetup({
    localCache:true,
    isCacheValid: network.isOffline,
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

function handleSuccessService(data) {
    console.log('Service started', data);
}

function handleErrorService(data) {
    console.log('Error starting service', data);
}

function handleSuccessUpdate(data) {
    console.log('Updates started', data);
}

function handleErrorUpdate(data) {
    console.log('Error starting updates', data);
}

document.addEventListener('deviceready', function () {
    if (typeof(loaded) !== 'undefined' && loaded) return;
    var Router = require('./router');
    var router = new Router();
    var authentication = new AuthenticationManager();
    // if (loggedInId) {
    //     authentication = new AuthenticationModel({ id: loggedInId });
    //     authentication.fetch();
    // } else {
    //     authentication = new AuthenticationModel();
    // }

    // setInterval(function (argument) {
    //     console.log('Alive');
    // }, 1000);

    Backbone.history.start();

    if (authentication.loggedIn()) {
        Backbone.history.navigate('#bookings', {trigger: true});
    } else {
        Backbone.history.navigate('#login', {trigger: true});
    }

    $('#main-navigation-bar').on('click', '.menu-button', function (event) {
        event.preventDefault();
        $('.view-container, .burger-menu-container').toggleClass('menu-open');
    });

    $('body').on('click', '.burger-menu-log-out', function (event) {
        event.preventDefault();
        authentication.logout();
        Backbone.history.navigate('#login', {trigger: true});
    });

    if (device.platform === 'android' || device.platform === 'Android') {
        backgroundService = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');
        backgroundService.startService(handleSuccessService, handleErrorService);
        backgroundService.registerForUpdates(handleSuccessUpdate, handleErrorUpdate);
    }

    pushNotifications.register();

    loaded = true;
});
