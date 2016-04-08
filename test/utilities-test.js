'use strict';
const Code = require('code');
const Lab = require('lab');
const Utilities = require('../lib/utilities.js');

const expect = Code.expect;
const lab = exports.lab = Lab.script();



lab.experiment('utilities', () => {


    lab.test('generateID', (done) => {

        //console.log(JSON.stringify(Utilities.generateID()));
        expect(Utilities.generateID()).to.exists();
        done();
    });


    lab.test('buildError', (done) => {

        //console.log(JSON.stringify(Utilities.buildError( 404, 'text')));
        expect(Utilities.buildError(404, 'text').output.payload).to.deep.equal({
            'statusCode': 404,
            'error': 'Not Found',
            'message': 'text'
        });
        done();
    });


    lab.test('clone', (done) => {

        expect(Utilities.clone({ x: 'y' })).to.deep.equal({ x: 'y' });
        done();
    });


    lab.test('isString', (done) => {

        expect(Utilities.isString(function () { })).to.equal(false);
        expect(Utilities.isString({})).to.equal(false);
        expect(Utilities.isString(null)).to.equal(false);
        expect(Utilities.isString(undefined)).to.equal(false);
        expect(Utilities.isString([])).to.equal(false);
        expect(Utilities.isString('string')).to.equal(true);
        expect(Utilities.isString(5)).to.equal(false);
        done();
    });


    lab.test('trim', (done) => {

        expect(Utilities.trim(' text ')).to.equal('text');
        done();
    });



});
