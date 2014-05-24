var primitives = require('./json-values/primitives');
var functions = require('./json-values/functions');
var booleans = require('./json-values/booleans');
var numbers = require('./json-values/numbers');
var objects = require('./json-values/objects');
var regexps = require('./json-values/regexps');
var strings = require('./json-values/strings');
var errors = require('./json-values/errors');
var arrays = require('./json-values/arrays');
var dates = require('./json-values/dates');

// var config = {
// 	SERIES_SIZE: 1000000,
// 	MUTATION_RATE: 0.05,
// 	CHROMOSOME_SIZE: 10,
// 	POPULATION_SIZE: 30,
// 	MAX_GENERATIONS: 100
// };

var config = {
	SERIES_SIZE: 100000,
	MUTATION_RATE: 0.05,
	CHROMOSOME_SIZE: 10,
	POPULATION_SIZE: 40,
	MAX_GENERATIONS: 100
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

function listAverage (list) {
	var sum = 0;
	var i = list.length;
	while(i--) {
		sum += list[i];
	}
	return sum / list.length
}

function getRandomNumberInValuesRange () {
	return Math.floor(Math.random() * (values.length - 1));
}

function getRandomNumberInPopulationRange () {
	return Math.floor(Math.random() * (config.POPULATION_SIZE - 1));
}

function getRandomValue () {
	var rand = getRandomNumberInValuesRange();
	return values[rand];
}

function getRandomValues () {
	var values = [];
	for(var i = 0; i < config.CHROMOSOME_SIZE; i++) {
		value = getRandomValue();
		values.push(value);
	}
	return values;
}

function getValue (i) {
	return [i, values[i]];
}

function rateIndividual (individual) {
	var values = individual.values;
	var jsonValues = JSON.stringify(values);
	var start = Date.now();
	var tmp;
	for(var i = 0; i < config.SERIES_SIZE; i++) {
		tmp = JSON.parse(jsonValues);
		tmp = undefined;
	}
	var end = Date.now();
	return end - start;
}

function ratePopulation (population) {
	var ratings = [];
	var individual;
	for(var i = 0; i < config.POPULATION_SIZE; i++) {
		console.log('> Rating ' + i + '/' + config.POPULATION_SIZE);
		individual = population[i];
		rating = rateIndividual(individual);
		ratings.push(rating);
	}
	return ratings;
}

function crossOverParents (population) {
	var parentAIndex = getRandomNumberInPopulationRange();
	var parentBIndex = getRandomNumberInPopulationRange();
	var parentA = population[parentAIndex];
	var parentB = population[parentBIndex];
	var allelA = parentA.values.slice(0, config.CHROMOSOME_SIZE / 2);
	var allelB = parentB.values.slice(config.CHROMOSOME_SIZE / 2, config.CHROMOSOME_SIZE);
	var child = {
		values: allelA.concat(allelB),
		generation: null
	};
	return child;
}

function crossOverPopulation (population, ratings, generation) {
	var index;
	var min;
	for(var i = 0; i < (config.POPULATION_SIZE / 4); i++) {
		min = Math.min.apply(Math, ratings);
		index = ratings.indexOf(min);
		population[index] = crossOverParents(population);
		population[index].generation = generation;
	}
	return population;
}

function mutatePopulation (population) {
	var mutatedGeneNumber;
	for(var i = 0; i < config.POPULATION_SIZE; i++) {
		if(Math.random() > config.MUTATION_RATE) {
			mutatedGeneNumber = getRandomNumberInPopulationRange();
			population[i].values[mutatedGeneNumber] = getRandomValue();
		}
	}
	return population;
}

function getInitialPopulation () {
	var population = [];
	var individual;
	for(var i = 0; i < config.POPULATION_SIZE; i++) {
		individual = {
			values: getRandomValues(),
			generation: 0
		};
		population.push(individual);
	}
	return population;
}

(function main () {

	var population = getInitialPopulation();
	var ratings;

	var historicMax;
	var max;

	for(var i = 0; i < config.MAX_GENERATIONS; i++) {

		ratings = ratePopulation(population);

		max = Math.max.apply(Math, ratings);
		if(historicMax === undefined || historicMax.rating < max) {
			historicMax = population[ratings.indexOf(max)];
			historicMax.rating = max;
		}

		console.log('\n> Generation :' + (i + 1) + '/' + config.MAX_GENERATIONS);
		console.log('> Ratings Average :' + listAverage(ratings) + '\n');
		// console.log(ratings);
		// console.log('\n> Population :');
		// console.log(population);

		population = crossOverPopulation(population, ratings, i + 1);

		population = mutatePopulation(population);

	}

	console.log('\n> Ratings :');
	console.log(ratings);
	console.log('\n> Population :');
	for(var k = 0; k < config.POPULATION_SIZE; k++) {
		console.log('\n> Individual ' + k + ' :');
		console.log(population[k].values);
		console.log(population[k].generation);
	}

	console.log('\n> Historic Max :');
	console.log(historicMax);

})();


