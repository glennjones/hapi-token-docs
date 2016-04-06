
'use strict';
const Boom = require('boom');
const Fs = require('fs');


module.exports = {


		generateID: function() {

			return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
		},


		buildError: function( code, error ){

    		return Boom.create( parseInt(code, 10), error);
		},

		clone: function( obj ){

			return( JSON.parse( JSON.stringify( obj ) ));
		},


		isString: function (obj) {

		    return typeof (obj) == 'string';
		},


		trim: function (str) {

    		return str.replace(/^\s+|\s+$/g, "");
		},


		isArray: function (obj) {
            
		    return obj && !(obj.propertyIsEnumerable('length'))
		        && typeof obj === 'object'
		        && typeof obj.length === 'number';
		}

};
