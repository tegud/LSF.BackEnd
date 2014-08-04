var expect = require('expect.js');
var async = require('async');
var http = require('http');
var proxyquire = require('proxyquire');
var fs = require('fs');

var EventEmitter = require('events').EventEmitter;

describe('LateSeatsFinder backend service', function() {
	var emailSentCallback;
	var watchLists = [];
	var eventEmitter = new EventEmitter();

	beforeEach(function() {
		emailSentCallback = function() {};
	});

	var fakeEmailSender = function() {
		return {
			send: function(details) {
				emailSentCallback(details);
			}
		};
	};

	var fakeFlightLoader = function() {
		return {
			on: function(name, fn) {
				eventEmitter.on(name, fn);
			}
		};
	};
	var fakeWatchListLoader = function() {
		return {
			getAll: function() {
				return watchLists;
			}
		};
	};

	var Application = proxyquire('../lib', {
		'./flights': fakeFlightLoader,
		'./watchList': fakeWatchListLoader,
		'./emailer': fakeEmailSender
	});

	it('sends email watchlist entry matching returned flight', function(done) {
		emailSentCallback = function(details) {
			expect(details).to.eql({
				watchDetails: {
					name: 'Steve Elliott',
					email: 'steve.elliott@laterooms.com',
					id: "MIAPMI201407311200"
				},
				flightDetails: {
					"arrival_date": "2014-07-31T15:30:00",
					"departure_airport": {
						"code": "MIA",
						"name": "Manchester Airport"
					},
					"departure_date": "2014-07-31T12:00:00",
					"destination_airport": {
						"code": "PMI",
						"name": "Palma Mallorca Airport"
					},
					"flight_number": "TOM5678",
					"id": "MIAPMI201407311200",
					"seats_remaining": 2
				}
			});

			done();
		};

		watchLists = [
			{
				name: 'Steve Elliott',
				email: 'steve.elliott@laterooms.com',
				id: 'MIAPMI201407311200'
			}
		];

		var app = new Application();
		app.start(function() {
			console.log('started');
			eventEmitter.emit('refreshComplete', [
				{
					"departure_airport": {
						"code": "MIA",
						"name": "Manchester Airport"
					},
					"destination_airport": {
						"code": "PMI",
						"name": "Palma Mallorca Airport"
					},
					"departure_date": "2014-07-31T12:00:00",
					"arrival_date": "2014-07-31T15:30:00",
					"flight_number": "TOM5678",
					"seats_remaining": 2,
					"id": "MIAPMI201407311200"
				}
			]);
		});
	});
});
