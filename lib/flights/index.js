var EventEmitter = require('events').EventEmitter;

var elasticsearch = require('elasticsearch');

function getFlights(client, callback) {
	client.search({
		index: 'lateseats',
		type: 'flight'
	}).then(function(elasticSearchResults) {
		var flights = [];

		if(elasticSearchResults.hits.total) {
			flights = elasticSearchResults.hits.hits.map(function(flight) {
				return flight._source;
			});
		}

		callback(null, flights);
	});
}

module.exports = function(options) {
	options = options || {};

	var eventEmitter = new EventEmitter();
	var refreshTimeout;
	var client = new elasticsearch.Client({
		host: '10.44.35.21:9200'
	});

	function onComplete(err, flights) {
		eventEmitter.emit('refreshComplete', flights);

		refreshTimeout = setTimeout(getFlights.bind(undefined, client, onComplete), options.refreshEvery || 1000);
	}

	setImmediate(function() {
		getFlights(client, onComplete);
	});

	return {
		on: function(eventName, fn) {
			eventEmitter.on(eventName, fn);
		},
		stop: function() {
			clearTimeout(refreshTimeout);
			eventEmitter.removeAllListeners();
		}
	};
};
