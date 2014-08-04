var nodemailer = require("nodemailer");
var _ = require('lodash');
var moment = require('moment');

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

			transport.sendMail({
				from: 'lateseats@laterooms.com',
				to: details.watchDetails.email,
				subject: 'Your late seat can be booked!',
				html: 'Yo ' + details.watchDetails.name + ', <br /><br />' + 'Here are your flight details:' +
					'<p>Outbound Flight: ' + moment(details.flightDetails.departure_date).format('DD MMM YYYY HH:mm') + ' from ' + details.flightDetails.departure_airport.name + '</p>' + 
					'<p>Return Flight: ' + moment(details.flightDetails.arrival_date).format('DD MMM YYYY HH:mm') + ' from ' + details.flightDetails.destination_airport.name + '</p>' + 
					'Thanks, </br> The Late Seats Finder Team'
			}, function (err, response) {
				if(err){
					console.log(err);
				} else {
					console.log("Message sent to " + details.watchDetails.email + ": " + response.message);
				}
			});
		}
	};
};

