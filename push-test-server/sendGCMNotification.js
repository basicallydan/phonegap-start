var gcm = require('node-gcm');

// or with object values
var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3
});

var sender = new gcm.Sender('AIzaSyA14e_Vb_1U6me7rhqrcqy7d1VHQF_AHIQ');
var registrationIds = [];

message.addData('title','My Game');
message.addData('message','Your turn!!!!');
message.addData('msgcnt','1');

// Get all the registration IDs to send this to
process.argv.forEach(function (val, index, array) {
    if (index >= 2) {
        registrationIds.push(val);
    }
});

/**
 * Params: message-literal, registrationIds-array, No. of retries, callback-function
 **/
sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
});