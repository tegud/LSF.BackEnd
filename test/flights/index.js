var expect = require('expect.js');
var async = require('async');
var http = require('http');
var proxyquire = require('proxyquire');
var fs = require('fs');

var elasticsearchResponse = {
	"took": 1,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 1,
		"max_score": 1,
		"hits": []
	}
};

var Flights = proxyquire('../../lib/flights', {
	'elasticsearch': {
		Client: function() {
			return {
				search: function() {
					return {
						then: function(callback) {
							callback(elasticsearchResponse);
						}
					};
				}
			};
		}
	}
});

describe.skip('flights', function() {
	it('checks for flights', function(done) {
		var flightsLoader = new Flights({ refreshEvery: 100 });

		elasticsearchResponse = JSON.parse(fs.readFileSync(__dirname + '/../data/five_flights.json', 'utf-8'));

		flightsLoader.on('refreshComplete', function(flights) {
			expect(flights).to.eql([
				{
					"id": "MIAPMI201407311200",
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
					"seats_remaining": 2
				},
				{
					"id": "MIAPMI201408050655",
					"departure_airport": {
						"code": "MIA",
						"name": "Manchester Airport"
					},
					"destination_airport": {
						"code": "PMI",
						"name": "Palma Mallorca Airport"
					},
					"departure_date": "2014-08-05T06:55:00",
					"arrival_date": "2014-08-05T10:30:00",
					"flight_number": "TOM2240",
					"seats_remaining": 5
				},
				{
					"id": "MIAPMI2014-08-020805",
					"departure_airport": {
						"code": "MIA",
						"name": "Manchester Airport"
					},
					"destination_airport": {
						"code": "PMI",
						"name": "Palma Mallorca Airport"
					},
					"departure_date": "2014-08-02T08:05:00",
					"arrival_date": "2014-08-02T11:40:00",
					"flight_number": "TOM2622",
					"seats_remaining": 3
				},
				{
					"id": "MIAMEN201408180935",
					"arrival_date": "2014-08-04T06:00:00",
					"departure_airport": {
						"Code": "MIA",
						"Name": "Manchester"
					},
					"departure_date": "2014-08-18T09:35:00",
					"destination_airport": {
						"Code": "MEN",
						"Name": "Menorca"
					},
					"nights": 14,
					"seats_remaining": 2
				},
				{
					"id": "MIAMEN201408010630",
					"arrival_date": "2014-08-01T06:30:00",
					"departure_airport": {
						"Code": "MIA",
						"Name": "Manchester"
					},
					"departure_date": "2014-08-09T12:50:00",
					"destination_airport": {
						"Code": "ANT",
						"Name": "Antalya"
					},
					"nights": 7,
					"seats_remaining": 1
				}
			]);

			flightsLoader.stop();

			done();
		});
	});

	it('refreshes flights', function(done) {
		var flightsLoader = new Flights();
		var refreshes = 0;

		var actualElasticsearchResponse = JSON.parse(fs.readFileSync(__dirname + '/../data/five_flights.json', 'utf-8'));

		flightsLoader.on('refreshComplete', function(flights) {
			elasticsearchResponse = actualElasticsearchResponse;

			if(refreshes++ === 2) {
				expect(flights).to.eql([
				{
					"id": "MIAPMI201407311200",
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
					"seats_remaining": 2
				},
				{
					"id": "MIAPMI201408050655",
					"departure_airport": {
						"code": "MIA",
						"name": "Manchester Airport"
					},
					"destination_airport": {
						"code": "PMI",
						"name": "Palma Mallorca Airport"
					},
					"departure_date": "2014-08-05T06:55:00",
					"arrival_date": "2014-08-05T10:30:00",
					"flight_number": "TOM2240",
					"seats_remaining": 5
				},
				{
					"id": "MIAPMI2014-08-020805",
					"departure_airport": {
						"code": "MIA",
						"name": "Manchester Airport"
					},
					"destination_airport": {
						"code": "PMI",
						"name": "Palma Mallorca Airport"
					},
					"departure_date": "2014-08-02T08:05:00",
					"arrival_date": "2014-08-02T11:40:00",
					"flight_number": "TOM2622",
					"seats_remaining": 3
				},
				{
					"id": "MIAMEN201408180935",
					"arrival_date": "2014-08-04T06:00:00",
					"departure_airport": {
						"Code": "MIA",
						"Name": "Manchester"
					},
					"departure_date": "2014-08-18T09:35:00",
					"destination_airport": {
						"Code": "MEN",
						"Name": "Menorca"
					},
					"nights": 14,
					"seats_remaining": 2
				},
				{
					"id": "MIAMEN201408091250",
					"arrival_date": "2014-08-01T06:30:00",
					"departure_airport": {
						"Code": "MIA",
						"Name": "Manchester"
					},
					"departure_date": "2014-08-09T12:50:00",
					"destination_airport": {
						"Code": "ANT",
						"Name": "Antalya"
					},
					"nights": 7,
					"seats_remaining": 1
				}
			]);

				flightsLoader.stop();

				done();
			}
		});
	});
});
