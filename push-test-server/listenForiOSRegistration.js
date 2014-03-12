var http = require('http');
var apn = require('apn');
var qs = require('querystring');
 
var server = http.createServer(function (req, res) {
    if(req.method === "POST") {
        var fullBody="";
     
        req.on('data', function(chunk) {
            fullBody += chunk;
            console.log("Full body " + fullBody);
        });
 
        req.on('end', function()
        {
            var data = JSON.parse(fullBody);
            console.log("Token " +data.token);
            console.log("Message " + data.message);
            // var myDevice = new apn.Device(data.token);
            // Now we need to store it! Add code to interface with a db below...
 
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("Thank you for registering\n");
            res.end();
        });
    }
}).listen(8888, '192.168.0.11');
console.log("Server running at http://192.168.0.11:8888");