var EventEmitter = require('events').EventEmitter;

module.exports = function() {
	var eventEmitter = new EventEmitter();

	setImmediate(function() {
		console.log('done');
		eventEmitter.emit('refreshComplete', {});
	});

	return {
		on: function(eventName, fn) {
			eventEmitter.on(eventName, fn);
		}
	};
};
