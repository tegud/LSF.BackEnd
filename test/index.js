var proxyquire = require('proxyquire');
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
			send: function() {
				emailSentCallback();
			}
		};
	};

	var fakeFlightLoader = function() {
		return {
			on: eventEmitter
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

	it.skip('sends email watchlist entry matching returned flight', function(done) {
		emailSentCallback = done;

		var app = new Application();
		app.start();

		eventEmitter.emit('refreshComplete', {});
	});
});
