var stringify = require('csv-stringify');
var fs = require('fs');

var primitives = require('./values/primitives');
var functions = require('./values/functions');
var booleans = require('./values/booleans');
var numbers = require('./values/numbers');
var objects = require('./values/objects');
var regexps = require('./values/regexps');
var strings = require('./values/strings');
var errors = require('./values/errors');
var arrays = require('./values/arrays');
var dates = require('./values/dates');

var config = {
	MAX_LOOPS: 1000000,
	MAX_SERIES: 100
};

var values = []
	.concat(primitives)
	.concat(functions)
	.concat(booleans)
	.concat(numbers)
	.concat(objects)
	.concat(regexps)
	.concat(strings)
	.concat(errors)
	.concat(arrays)
	.concat(dates);

function deserializeValue (value) {
	var serialized = JSON.stringify({
		a: value
	});
	var tmp;
	var s_1 = Date.now();
	for(var i = 0; i < config.MAX_LOOPS; i++) {
		tmp = JSON.parse(serialized);
		tmp = undefined;
	}
	var e_1 = Date.now();
	return e_1 - s_1;
}

function serializeValue (value) {
	var tmp;
	var s_1 = Date.now();
	for(var i = 0; i < config.MAX_LOOPS; i++) {
		tmp = JSON.stringify({
			a: value
		});
		tmp = undefined;
	}
	var e_1 = Date.now();
	return e_1 - s_1;
}

function launchSeries () {
	var times = [];
	var value;
	for(var i = 0, len = values.length; i < len; i++) {
		console.log('\n> Value ' + i + '/' + len);
		value = values[i];
		// time = serializeValue(value);
		time = deserializeValue(value);
		times.push(time);
	}
	return times;
}

function launchExperiments () {
	var times = [];
	var time;
	for(var i = 0; i < config.MAX_SERIES; i++) {
		console.log('\n> Series ' + i + '/' + config.MAX_SERIES);
		time = launchSeries();
		times.push(time);
	}
	return times;
}

(function main () {
	var times = launchExperiments();

	// stringify(times, function (e, csv) {
	// 	if(e) {
	// 		return console.log(e);
	// 	}

	// 	fs.writeFile('serializing.csv', csv, function (e) {
	// 		if(e) {
	// 			return console.log(e);
	// 		}

	// 		console.log('Done!');
	// 	});
	// });

	stringify(times, function (e, csv) {
		if(e) {
			return console.log(e);
		}

		fs.writeFile('deserializing.csv', csv, function (e) {
			if(e) {
				return console.log(e);
			}

			console.log('Done!');
		});
	});
})();

