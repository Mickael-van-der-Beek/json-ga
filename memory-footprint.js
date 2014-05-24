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

function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

function calculateMemoryFootprint (value) {
	return JSON.stringify({
		a: value
	}).length - JSON.stringify({
		//a: ''
	}).length;
}

function loopValues () {
	var footprints = [];
	var value;
	for(var i = 0, len = values.length; i < len; i++) {
		value = values[i];
		//footprint = roughSizeOfObject(value);
		footprint = calculateMemoryFootprint(value);
		footprints.push(footprint);
	}
	return footprints;
}

(function main () {

	// var footprints = [loopValues()];

	// stringify(footprints, function (e, csv) {
	// 	if(e) {
	// 		return console.log(e);
	// 	}

	// 	fs.writeFile('memory-footprint3.csv', csv, function (e) {
	// 		if(e) {
	// 			return console.log(e);
	// 		}

	// 		console.log('Done!');
	// 	});
	// });

	console.log('8');
	console.log(values[7]);
	console.log('9');
	console.log(values[8]);

	console.log('51');
	console.log(values[50]);
	console.log('52');
	console.log(values[51]);
	console.log('53');
	console.log(values[52]);

})();


