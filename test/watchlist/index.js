var expect = require('expect.js');
var async = require('async');
var http = require('http');
var proxyquire = require('proxyquire');

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

var WatchList = proxyquire('../../lib/watchlist', {
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

describe('watchlist', function() {
	it('populates the watchlist', function(done) {
		elasticsearchResponse = {
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
				"hits": [
					{
						"_index": "lateseats",
						"_type": "watchlist",
						"_id": "obXEFOIDQ5e94HJ04xKLZg",
						"_score": 1,
						"_source": {
							"name": "Steve Elliott",
							"email": "steve.elliott@laterooms.com"
						}
					}
				]
			}
		};

		var watchList = new WatchList();

		watchList.on('refreshComplete', function() {
			expect(watchList.getAll()).to.eql([
				{ "name": "Steve Elliott", "email": "steve.elliott@laterooms.com" }
			]);

			done();
		});
	});
});
