var nodemailer = require("nodemailer");
var _ = require('lodash');
var moment = require('moment');
var http = require('http');

module.exports = function() {
	var transport;

	function notifyComplete(err, response) {
		if(err){
			console.log(err);
		} else {
			console.log("Message sent: " + response.message);
		}
	}
	transport = nodemailer.createTransport("SMTP", {
		host: 'smtp.laterooms.com'
	});

	return {
		send: function(details) {
			console.log('send mail!');

			var payload = {
				name: details.watchDetails.name,
				email: details.watchDetails.email,
				flights: [
					details.flightDetails
				]
			};

			payload.flights[0].return_date = details.flightDetails.departure_date;

			// {
			// 	"name": "james kirk",
			// 	"email": "james.kirk@laterooms.com",
			// 	"flights": [
			// 		{
			// 			"departure_airport" : {
			// 				"code": "MIA",
			// 				"name": "Manchester Airport" 
			// 			},
			// 			"destination_airport" : {
			// 				"code": "PMI",
			// 				"name": "Palma Mallorca Airport"
			// 			},
			// 			"departure_date" : "2014-07-31T10:00:00",
			// 			"arrival_date" : "2014-07-31T13:30:00",
			// 			"return_date": "2014-08-31T10:00:00"
			// 		}
			// 	]
			// }

			console.log(details.flightDetails)

			http.request({
				host: '10.44.15.158',
				path: '/?json=' + encodeURIComponent(JSON.stringify(payload)),
				method: 'POST'
			}, function(response) {
				var str = ''
				response.on('data', function (chunk) {
					str += chunk;
				});

				response.on('end', function () {
					console.log('EMAIL SENT TO END POINT SUCCESSFULLY');
				});
			}).end();
		}
	};
};
