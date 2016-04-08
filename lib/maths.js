'use strict';
const ConvertBase = require('convert-base');
const converter = new ConvertBase();
const internals = {};


module.exports = {


    // 'add'
    add: (options, callback) => {

        let result;
        if (internals.validNumbers(options)) {
            result = options.a + options.b;
            callback(null, internals.toFormat(options, result));
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    },


    // 'subtract'
    subtract: (options, callback) => {

        let result;
        if (internals.validNumbers(options)) {
            result = options.a - options.b;
            callback(null, internals.toFormat(options, result));
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    },


    // 'divide'
    divide: (options, callback) => {

        let result;
        if (internals.validNumbers(options)) {
            if (!internals.isZero(options.a) && !internals.isZero(options.b)) {
                result = options.a / options.b;
                callback(null, internals.toFormat(options, result));
            } else {
                callback('One of the supplied numbers is set zero. You cannot divide by zero.', null);
            }
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    },


    // 'multiple'
    multiple: (options, callback) => {

        let result;
        if (internals.validNumbers(options)) {
            result = options.a * options.b;
            callback(null, internals.toFormat(options, result));
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    }


};



// tests that object has properties a and b and they are both numbers
internals.validNumbers = function (options) {

    if (options.hasOwnProperty('a') &&
        options.hasOwnProperty('b') &&
        internals.isNumber(options.a) &&
        internals.isNumber(options.b)
    ) {
        return true;
    }
    return false;
};


// if options has a binary format convert number
internals.toFormat = function (options, result) {

    if (options.format === 'binary') {
        return converter.convert(result, 10, 2);  // decimal to binary
    }
    return result;
};


// is object a number
internals.isNumber = function (n) {

    return (!isNaN(parseFloat(n)) && isFinite(n));
};


// is object a number that a 0 (zero)
internals.isZero = function (obj) {

    if (internals.isNumber(obj) && obj === 0) {
        return true;
    }
    return false;
};
