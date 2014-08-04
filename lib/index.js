var _ = require('lodash');
var moment = require('moment');

var Emailer = require('./emailer');
var FlightLoader = require('./flights');
var WatchList = require('./watchList');

function filterFlightsByWatchList(flights, watched) {
	var combined = _.map(watched, function(watchItem) {
		var matchingFlights = _.filter(flights, function(flight) {
			console.log((flight.id === watchItem.id) + ' -> ' + flight.id + ' vs ' + watchItem.id);

			return flight.id === watchItem.id;
		});

		if(!matchingFlights.length) {
			return;
		}

		return {
			watchDetails: watchItem,
			flightDetails: matchingFlights[0]
		};
	});

	return _.filter(combined, function(item) { 
		return item;
	});
}

var app = function() {
	var sentMails = {};

	return {
		start: function(callback) {
			var flightLoader = new FlightLoader({ refreshEvery: 5000 });
			var watchList = new WatchList({ refreshEvery: 30000 });
			var emailer = new Emailer();

			flightLoader.on('refreshComplete', function(flights) {
				var watched = watchList.getAll();

				console.log('Watching: ' + watched.length + ' items');

				var filteredList = filterFlightsByWatchList(flights, watched);

				_.each(filteredList, function(item) {
					var id = item.watchDetails.email + '|' + item.watchDetails.id;
					if(sentMails[id]) {
						return true;
					}

					emailer.send(item);

					sentMails[id] = true;
				});
			});

			if(callback) {
				callback();
			}
		}
	};
};

app().start();
