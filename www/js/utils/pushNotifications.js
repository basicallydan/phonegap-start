// Sadly, we need to declare some global functions
onNotificationAPN = undefined;
onNotificationGCM = undefined;
foregroundNotification = undefined;
backgroundNotification = undefined;
var pushNotification;
var $ = require('jquery');

// result contains any message sent from the plugin call
function successHandler(result) {
    console.log('Success. Result:', result);
}

// result contains any error description text returned from the plugin call
function errorHandler(error) {
    console.log('Error. Result:', error, arguments);
    debugLog(JSON.stringify(error));
}

function iOSTokenHandler(result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    console.log('Success with iOS reg:', result);
    debugLog(result);

    $.ajax({
        url: 'http://192.168.0.11:8888',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            token:result,
            message:'done'
        })
    });
}

function debugLog(what) {
    $('.gcm-registration-id').append('<br />' + JSON.stringify(what));
    // if (navigator.notification && navigation.notification.alert) {
    //     navigator.notification.alert(what);
    // } else {
    //     alert(what);
    // }
}

// iOS
onNotificationAPN = function onNotificationAPN(event) {
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }

    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
};

// Android
onNotificationGCM = function onNotificationGCM(e) {
    console.log('Event received:', e.event);

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                debugLog(e.regid);
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log('Registration Id is', e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                // $('#app-status-ul').append('<li>--INLINE NOTIFICATION--' + '</li>');

                // if the notification contains a soundname, play it.
                // var my_media = new Media('/android_asset/www/'+e.soundname);
                // my_media.play();
            } else { // otherwise we were launched because the user touched a notification in the notification tray.
                // if ( e.coldstart )
                // {
                //     $('#app-status-ul').append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                // }
                // else
                // {
                //     $('#app-status-ul').append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                // }
            }

            window.plugin.notification.local.add({ message: e.payload.message });

            alert('Message:', e.payload.message);
            alert('Message Cont:', e.payload.msgcnt);
            break;

        case 'error':
            alert('Error:', e.msg);
            // $('#app-status-ul').append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            alert('Notification but confused');
            // $('#app-status-ul').append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
};

foregroundNotification = function foregroundNotification (id) {
    console.log('I WAS RUNNING ID='+id);
};

backgroundNotification = function backgroundNotification (id) {
    console.log('I WAS IN THE BACKGROUND ID='+id);
};

function register() {
    if (!window.plugins.pushNotification || typeof(device) === 'undefined') {
        console.log('No push notification available.');
        debugLog('No push notification available');
        return;
    }
    pushNotification = window.plugins.pushNotification;
    if (device.platform == 'android' || device.platform == 'Android') {
        console.log('Registering for Android Push notifications from GCM');
        pushNotification.register(
            successHandler,
            errorHandler, {
                'senderID': '452648157931',
                'ecb': 'onNotificationGCM'
            });
    } else {
        console.log('Registering for Apple Push notifications from APN');
        debugLog('Registering for Apple Push notifications from APN');
        pushNotification.register(
            iOSTokenHandler,
            errorHandler, {
                'badge': 'true',
                'sound': 'true',
                'alert': 'true',
                'ecb': 'onNotificationAPN'
            });
    }
}

module.exports = {
    register: register
};