var EventEmitter = require('events').EventEmitter;
var elasticsearch = require('elasticsearch');
var WatchListArray = require('./watchListArray');

function getList(client, callback) {
	client.search({
		index: 'lateseats',
		type: 'watchlist'
	}).then(function(elasticSearchResults) {
		var watchList;

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

		callback(null, watchList);
	});
}

module.exports = function(options) {
	options = options || {};

	var eventEmitter = new EventEmitter();
	var client = new elasticsearch.Client({
		host: '10.44.35.21:9200'
	});
	var watchList = new WatchListArray();
	var refreshTimeout;

	var onComplete = function(options, watchList, eventEmitter, err, list) {
		watchList.set(list);
		eventEmitter.emit('refreshComplete'); 

		if(options.refreshEvery) {
			setTimeout(getListTasks, options.refreshEvery || 1000);
		}
	};

	var getListTasks = getList.bind(undefined, client, onComplete.bind(undefined, options, watchList, eventEmitter));

	setImmediate(getListTasks);

	return {
		on: function(eventName, fn) {
			eventEmitter.on(eventName, fn);
		},
		getAll: function() {
			return watchList.get();
		},
		stop: function() {
			clearTimeout(refreshTimeout);
			eventEmitter.removeAllListeners();
		}
	};
};
