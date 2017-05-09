
var http = require("http");
var qs = require('querystring');
var twilio = require('twilio');



function handleRequest(request, response) {

    if (request.method === 'POST') {
        var body = '';
        request.on('data', function (chunk) {
            body += chunk;
        });
        request.on('end', function () {
            var data = qs.parse(body);
            
            
            var result = Send_SMS(data.phone);
            
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end("Response " + result);
        });
    } else {
        response.writeHead(404);
        response.end();
    }
}

http.createServer(handleRequest).listen(8081);


console.log('Server running at http://127.0.0.1:8081/');




function Send_SMS(mob_number)
{
    var accountSid = '';
    var authToken = '';

    var client = new twilio(accountSid, authToken);
    var TimeState = CheckTime();
    var message = "";
    switch (TimeState)
    {
        case "AM":
            message = "Good morning! Your promocode is AM123";
            break;

        case "PM":
            message = "Hello! Your promocode is PM456";
            break;
    }

    var response = "";
    client.messages.create({
        body: message,
        to: mob_number,  // Text this number
        from: '+14088995836' // From a valid Twilio number
    }, function(err, msg) {    
        if (err) {
            console.log("Error: " + err);
            respone = err;
        }
        else
        {
            console.log("SMSId: " + msg.sid);
            response = msg.sid;
        }
    });
}

function CheckTime()
{
    var Hours = new Date().getHours();
    var TimeState = (Hours >= 12) ? "PM" : "AM";
    
    return TimeState;
}
