
'use strict';
const Boom = require('boom');


module.exports = {


    generateID: () => {

        return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4);
    },


    buildError: (code, error) => {

        return Boom.create(parseInt(code, 10), error);
    },


    clone: (obj) => {

        return (JSON.parse(JSON.stringify(obj)));
    },


    isString: (obj) => {

        return typeof (obj) === 'string';
    },


    trim: (str) => {

        return str.replace(/^\s+|\s+$/g, '');
    }

};
