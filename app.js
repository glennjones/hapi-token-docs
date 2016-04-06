'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Blipp = require('blipp');
const Hoek = require('hoek');
const JWT = require('jsonwebtoken');
const HapiJWT2 = require('hapi-auth-jwt2');
const Bell = require('bell');
const AuthCookie = require('hapi-auth-cookie');
const Pack = require('./package');
const Routes = require('./lib/routes.js');


const appendAuthMessages = function( routes ){

    routes.forEach( (route) => {
        if(Hoek.reach(route, 'config.tags')){
            const tags = Hoek.reach(route, 'config.tags');
            if(tags.indexOf('api') > -1){

                if(!route.config.notes){
                    route.config.notes = []
                }

                if(route.config.auth === 'jwt'){
                    route.config.notes.push('__Token is required to access this endpoint. Make sure your sign in.__');
                }
            }
        }
    });
}

appendAuthMessages( Routes );


const privateKey = process.env.PRIVATEKEY;
const info = {
        version: Pack.version,
        title: 'Hapi - token - docs',
        description: 'This web API was built to demonstrate some of the hapi features and functionality.'
    }


const server = new Hapi.Server({
    app: {
        'privateKey': privateKey,
        'info': info,
    }
});
server.connection({
    host: (process.env.PORT) ? '0.0.0.0' : 'localhost',
    port: (process.env.PORT || 3033),
    routes: { cors: true }
});


// setup swagger options
const swaggerOptions = {
    info: info,
    tags: [{
        'name': 'sum',
        'description': 'Working with maths',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }, {
        'name': 'store',
        'description': 'Storing your sums for later use',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }],
    securityDefinitions: {
        'jwt': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    security: [{ 'jwt': [] }],
    auth: false
};


//  validation function for JWT token
var validate = function (decoded, request, callback) {

    // add yours checks here i.e. is the user valid
    if (decoded.id && decoded.name) {
        return callback(null, true, decoded);
    } else {
        return callback(null, false);
    }
};



// register plug-ins
server.register([
    AuthCookie,
    Bell,
    HapiJWT2,
    Inert,
    Vision,
    Blipp,
    {
        register: require('hapi-swagger'),
        options: swaggerOptions
    }
    ], function (err) {

        if(err){
            console.log(err);
        }

        server.auth.strategy('hapi-token-docs-cookie', 'cookie', {
            password: process.env.COOKIE_PASSWORD,
            cookie: 'hapi-token-docs',
            isSecure: false
        });

        server.auth.strategy('github-oauth', 'bell', {
            provider: 'github',
            password: process.env.GITHUB_PASSWORD,
            clientId: process.env.GITHUB_CLIENTID,
            clientSecret: process.env.GITHUB_CLIENTSECRET,
            isSecure: false
        });

        server.auth.strategy('jwt', 'jwt', {
            key: privateKey,
            validateFunc: validate,
            verifyOptions: { algorithms: [ 'HS256' ] }
        });

        server.auth.default('hapi-token-docs-cookie');

        // add routes
        server.route(Routes);

        server.start(function(){
            console.log('Server running at:', server.info.uri);
        });
    });



// add templates support with handlebars
server.views({
    path: 'templates',
    engines: { html: require('handlebars') },
    partialsPath: './templates/withPartials',
    helpersPath: './templates/helpers',
    isCached: false
})
