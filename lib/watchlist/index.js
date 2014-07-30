var EventEmitter = require('events').EventEmitter;
var elasticsearch = require('elasticsearch');

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
	var eventEmitter = new EventEmitter();
	var client = new elasticsearch.Client({
		host: '10.44.35.21:9200'
	});
	var watchList = [];
	var refreshTimeout;
	var onComplete = function(err, list) {
		watchList = list;
		eventEmitter.emit('refreshComplete'); 

		refresh();
	};
	var getListTasks = getList.bind(undefined, client, onComplete);

	if(!options) {
		options = {};
	}


	var refresh = function() {
		refreshTimeout = setTimeout(getListTasks, options.refreshEvery || 1000);
	};

	setImmediate(function() {
		getListTasks();
	});

	return {
		on: function(eventName, fn) {
			eventEmitter.on(eventName, fn);
		},
		getAll: function() {
			return watchList;
		},
		stop: function() {
			clearTimeout(refreshTimeout);
			eventEmitter.removeAllListeners();
		}
	};
};
