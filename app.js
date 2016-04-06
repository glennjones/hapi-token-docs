'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Blipp = require('blipp');
const JWT = require('jsonwebtoken');
const HapiJWT2 = require('hapi-auth-jwt2');
const Pack = require('./package');
const Routes = require('./lib/routes.js');


const  server = new Hapi.Server();
server.connection({
    host: (process.env.PORT) ? '0.0.0.0' : 'localhost',
    port: (process.env.PORT || 3033),
    routes: { cors: true }
});




var people = { // our "users database"
    56732: {
      id: 56732,
      name: 'Jen Jones',
      scope: ['a', 'b']
    }
};

var privateKey ='hapi hapi joi joi';
var token = JWT.sign({ id: 56732 }, privateKey, { algorithm: 'HS256'} );

// bring your own validation function
var validate = function (decoded, request, callback) {

    // do your checks to see if the person is valid
    if (!people[decoded.id]) {
      return callback(null, false);
    }
    else {
      return callback(null, true, people[decoded.id]);
    }
};




// setup swagger options
const swaggerOptions = {
    info: {
        version: Pack.version,
        title: 'Hapi - token - docs',
        description: 'This web API was built to demonstrate some of the hapi features and functionality.'
    },
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
    security: [{ 'jwt': [] }]
};

// register plug-ins
server.register([
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

        server.auth.strategy('jwt', 'jwt', {
            key: privateKey,
            validateFunc: validate,
            verifyOptions: { algorithms: [ 'HS256' ] }
        });

        // add routes
        server.route(Routes);
        server.route({
            method: 'GET',
            path: '/token',
            config: {
                auth: false,
                tags: ['api'],
                handler: function(request, reply) {
                    reply({token: token})
                }
            }
        })

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





