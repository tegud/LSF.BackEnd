module.exports = function() {
	var watchList = [];

	return {
		get: function() {
			return watchList;
		},
		set: function(newList) {
			watchList = newList;
		}
	};
};
