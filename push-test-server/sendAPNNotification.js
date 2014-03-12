var http = require('http');
var apn = require('apn');
var url = require('url');
 
var myPhone = "9aedaa320a0f0c20232511c821a363d9901eb4be2610bf4d485f4fb64c622572";
// var myiPad = "51798aaef34f439bbb57d6e668c5c5a780049dae840a0a3626453cd4922bc7ac";
 
var myDevice = new apn.Device(myPhone);
 
var note = new apn.Notification();
note.badge = 1;
note.sound = "notification-beep.wav";
note.alert = { "body" : "Your turn!", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
note.payload = {'messageFrom': 'Holly'};
 
note.device = myDevice;
 
var callback = function(errorNum, notification){
    console.log('Error is: %s', errorNum);
    console.log("Note " + notification);
};
var options = {
    gateway: 'gateway.sandbox.push.apple.com', // this URL is different for Apple's Production Servers and changes when you go to production
    errorCallback: callback,
    cert: './apple-certificates-and-profiles/Upmysport-Push-Dev-Cert.pem',
    key:  './apple-certificates-and-profiles/Upmysport-Push-Dev-Key.pem',
    passphrase: 'upmysport',
    port: 2195,
    enhanced: true,
    cacheLength: 100
};
var apnsConnection = new apn.Connection(options);
apnsConnection.sendNotification(note);