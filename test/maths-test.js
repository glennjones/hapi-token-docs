'use strict';
const Code = require('code');
const Lab = require('lab');
const maths = require('../lib/maths');

const expect = Code.expect;
const lab = exports.lab = Lab.script();


// units tests math.js

lab.experiment('Math', () => {

    lab.test('should add numbers together', (done) => {

        let options = {
            a: 5,
            b: 5
        };
        maths.add(options, (error, result) => {

            expect(result).to.equal(10);
            expect(error).to.equal(null);
            done();
        });
    });


    lab.test('should capture type errors', (done) => {

        let options = {
            a: 'text',
            b: 5
        };
        maths.add(options, (error, result) => {

            expect(result).to.equal(null);
            expect(error).to.equal('The one of the two numbers was not provided');
            done();
        });
    });


    lab.test('should capture missing input errors', (done) => {

        let options = {
            a: '5'
        };
        maths.add(options, (error, result) => {

            expect(result).to.equal(null);
            expect(error).to.equal('The one of the two numbers was not provided');
            done();
        });
    });


    lab.test('should subtract numbers', (done) => {

        let options = {
            a: 10,
            b: 5
        };
        maths.subtract(options, (error, result) => {

            expect(result).to.equal(5);
            expect(error).to.equal(null);
            done();
        });
    });


    lab.test('should divide numbers', (done) => {

        let options = {
            a: 10,
            b: 5
        };
        maths.divide(options, (error, result) => {
            expect(result).to.equal(2);
            expect(error).to.equal(null);
            done();
        });
    });


    lab.test('should divide capture divide by zero errors', (done) => {

        let options = {
            a: 10,
            b: 0
        };
        maths.divide(options, (error, result) => {

            expect(result).to.equal(null);
            expect(error).to.equal('One of the supplied numbers is set zero. You cannot divide by zero.');
            done();
        });
    });


    lab.test('should multiple numbers', (done) => {

        let options = {
            a: 10,
            b: 5
        };
        maths.multiple(options, (error, result) => {

            expect(result).to.equal(50);
            expect(error).to.equal(null);
            done();
        });
    });

});
