var flightLoader = new require('./flights')({ refreshEvery: 5000 });
var watchList = new require('./watchList')({ refreshEvery: 30000 });

module.exports = function() {

	return {
		start: function() {}
	};
};
