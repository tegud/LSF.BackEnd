var expect = require('expect.js');
var async = require('async');
var http = require('http');
var proxyquire = require('proxyquire');

var WatchList = require('../../lib/watchlist');

describe('watchlist', function() {
	it('populates the watchlist', function(done) {
		var watchList = new WatchList();

		watchList.on('refreshComplete', function() {
			done();
		});
	});
});
