'use strict';
const Boom = require('boom');
const Joi = require('joi');
const Mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const Maths = require('../lib/maths.js');
const Store = require('../lib/store.js');
const Utils = require('../lib/utilities.js');


const internals = {};
// moungodb connection for store
const adminId = 175288; // github user id for glennjones
const norights = Boom.unauthorized('You need admin rights to add, remove and update a stored item');
const mongodbURL = (process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/be-more-hapi');
const connection = Mongoose.createConnection(mongodbURL);
const store = new Store(Mongoose, connection);

Mongoose.connection.on('error', (err) => {
    console.log(['error'], 'moungodb connect error: ' + err);
});



module.exports = {


    index: function (request, reply) {

        let context = { title: 'HAPI - Token - Docs' };
        if (request.auth.isAuthenticated) {
            context.isAuthenticated = true;
            context.name = request.auth.credentials.profile.displayName;
            context.token = request.auth.credentials.token;
        }
        reply.view('index.html', context);
    },


    login: function (request, reply) {

        if (request.auth.isAuthenticated) {

            // get data from github
            const privateKey = request.server.settings.app.privateKey;
            const id = request.auth.credentials.profile.id;
            const name = request.auth.credentials.profile.displayName;

            // create token with github data
            request.auth.credentials.token = JWT.sign({
                id: id,
                name: name
            }, privateKey, { algorithm: 'HS256' });

            // set cookie and redirect to docs
            request.cookieAuth.set(request.auth.credentials);
            reply.redirect('/');
        } else {
            // reply with error
            reply('Not logged in...').code(401);
        }
    },


    logout: function (request, reply) {

        request.cookieAuth.clear();
        reply.redirect('/');
    },


    account: function (request, reply) {

        let context = { title: request.server.settings.app.info.title };
        if (request.auth.isAuthenticated) {
            context.id = request.auth.credentials.profile.id;
            context.name = request.auth.credentials.profile.displayName;
            context.token = request.auth.credentials.token;
        }
        reply.view('account.html', context);
    },


    license: function (request, reply)  {

        reply.view('license.html', {
            title: request.server.settings.app.info.title,
            year: new Date().getFullYear()
        });
    },


    // Sums
    /* ----------------------------------------------------------------------------------- */

    add: function (request, reply) {

        Maths.add(internals.buildOptions(request), (error, result) => {

            internals.renderJSON(request, reply, error, { 'equals': parseFloat(result) });
        });
    },


    subtract: function (request, reply) {

        Maths.subtract(internals.buildOptions(request), (error, result) => {

            internals.renderJSON(request, reply, error, { 'equals': parseFloat(result) });
        });
    },


    divide: function (request, reply) {

        Maths.divide(internals.buildOptions(request), (error, result) => {

            internals.renderJSON(request, reply, error, { 'equals': parseFloat(result) });
        });
    },


    multiple: function (request, reply) {

        Maths.multiple(internals.buildOptions(request), (error, result) => {

            internals.renderJSON(request, reply, error, { 'equals': parseFloat(result) });
        });
    },


    // Store
    /* ----------------------------------------------------------------------------------- */

    storeList: function (request, reply) {

        let options = {
            query: {}
        };
        // add defaults as these querystring are optional
        options.page = (request.query.page) ? parseInt(request.query.page, 10) : 1;
        options.pageSize = (request.query.pagesize) ? parseInt(request.query.pagesize, 10) : 20;

        store.list(options, (error, result) => {

            internals.renderJSON(request, reply, error, result);
        });
    },


    storeItem: function (request, reply) {

        let options = {
            id: request.params.id
        };

        store.get(options, (error, result) => {
            if (result) {
                result = Utils.clone(result);
            }
            internals.renderJSON(request, reply, error, result);
        });
    },


    storeAdd: function (request, reply) {

        if (internals.checkAdminScope(request)) {
            let options = request.payload;
            if (request.query.a) {
                options = {
                    a: parseFloat(request.query.a),
                    b: parseFloat(request.query.b),
                    operator: request.query.operator,
                    equals: parseFloat(request.query.equals)
                };
            }
            store.add(options, (error, result) => {

                internals.renderJSON(request, reply, error, result);
            });
        } else {
            reply( norights );
        }
    },


    storeAddFile: function (request, reply) {

        if (internals.checkAdminScope(request)) {
            let payload = request.payload;
            let data = '';

            console.log(payload.file[0]);

            // check that required file is present
            // the filepath property incorrectlty uses a string 'undefined'
            if (payload.file && payload.file[0] !== 'undefined') {

                var file = payload.file[1],
                    headers = file.hapi.headers;

                // check the content-type is json
                if (headers['content-type'] === 'application/json') {

                    // read the stream
                    file.on('data', (chunk) => {

                        data += chunk;
                    });

                    // once we have all the data
                    file.on('end', () => {

                        // use Joi to validate file data format
                        var addSumSchema = Joi.object().keys({
                            a: Joi.number().required(),
                            b: Joi.number().required(),
                            operator: Joi.string().required(),
                            equals: Joi.number().required()
                        });

                        Joi.validate(data, addSumSchema, (err, value) => {

                            if (err) {
                                reply(Boom.badRequest('JSON file has incorrect format or properties. ' + err));
                            } else {
                                store.add(JSON.parse(data), (error, result) => {

                                    internals.renderJSON(request, reply, error, result);
                                });
                            }
                        });
                    });

                } else {
                    reply(Boom.unsupportedMediaType());
                }

            } else {
                reply(Boom.badRequest('File is required'));
            }
        } else {
            reply( norights );
        }
    },


    storeUpdate: function (request, reply) {

        if (internals.checkAdminScope(request)) {
            let options = {
                id: request.params.id,
                a: parseFloat(request.payload.a),
                b: parseFloat(request.payload.b),
                operator: request.payload.operator,
                equals: parseFloat(request.payload.equals)
            };

            store.update(options, (error, result) => {
                internals.renderJSON(request, reply, error, result);
            });
        } else {
            reply( norights );
        }
    },


    storeRemove: function (request, reply) {

        if (internals.checkAdminScope(request)) {
            let options = {
                id: request.params.id
            };
            store.remove(options, (error, result) => {

                internals.renderJSON(request, reply, error, result);
            });
        } else {
            reply( norights );
        }
    }
};


// create options object from request
internals.buildOptions = function (request) {

    let options = {
        a: 0,
        b: 0,
        format: 'decimal'
    };

    if (request.headers && request.headers['x-format']) {
        options.format = request.headers['x-format'];
    }
    if (request.query && request.query.a) {
        // querystring
        options.a = parseFloat(request.query.a);
        options.b = parseFloat(request.query.b);
    } else if (request.params && request.params.a) {
        // url params or fragment
        options.a = parseFloat(request.params.a);
        options.b = parseFloat(request.params.b);
    }
    return options;
};


// render json out to http stream
internals.renderJSON = function (request, reply, error, result) {

    if (error) {
        if (Utils.isString(error)) {
            reply(Utils.buildError(400, error));
        } else {
            reply(error);
        }
    } else {
        reply(result).type('application/json; charset=utf-8');
    }
};


internals.checkAdminScope = function (request) {

    const id = request.auth.credentials.id;
    return (id === adminId);

};








