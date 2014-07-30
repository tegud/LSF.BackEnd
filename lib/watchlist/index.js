var EventEmitter = require('events').EventEmitter;
var elasticsearch = require('elasticsearch');

module.exports = function() {
	var eventEmitter = new EventEmitter();
	var client;
	var watchList = [];

	setImmediate(function() {
		client = new elasticsearch.Client({
			host: '10.44.35.21:9200'
		});

		client.search({
			index: 'lateseats',
			type: 'watchlist'
		}).then(function(elasticSearchResults) {
			if(!elasticSearchResults.hits.total) {
				watchList = [];
			}
			else {
				watchList = elasticSearchResults.hits.hits.map(function(item) {
					return {
						name: item._source.name,
						email: item._source.email
					};
				});
			}

			eventEmitter.emit('refreshComplete');
		});
	});

	return {
		on: function(eventName, fn) {
			eventEmitter.on(eventName, fn);
		},
		getAll: function() {
			return watchList;
		}
	};
};
