'use strict';

const Joi = require('joi');
const handlers = require('../lib/handlers.js');



const sumModel = Joi.object({
    id: Joi.string().required().example('x78P9c'),
    a: Joi.number().required().example(5),
    b: Joi.number().required().example(5),
    operator: Joi.string().required().description('either +, -, /, or *').example('+'),
    equals: Joi.number().required().example(10),
    created: Joi.string().required().isoDate().description('ISO date string').example('2015-12-01'),
    modified: Joi.string().isoDate().description('ISO date string').example('2015-12-01')
}).label('Sum').description('json body for sum');


const listModel = Joi.object({
    items: Joi.array().items(sumModel),
    count: Joi.number().required().example('1'),
    pageSize: Joi.number().required().example('10'),
    page: Joi.number().required().example('1'),
    pageCount: Joi.number().required().example('1')
}).label('List');


const resultModel = Joi.object({
    equals: Joi.number()
}).label('Result');


const errorModel = Joi.object({
    code: Joi.number(),
    msg: Joi.string()
}).label('Error');


const sumHTTPStatus = {
    '200': {
        'description': 'Success',
        'schema': sumModel
    },
    '400': {
        'description': 'Bad Request',
        'schema': errorModel
    },
    '500': {
        'description': 'Internal Server Error',
        'schema': errorModel
    }
};


const listHTTPStatus = {
    '200': {
        'description': 'Success',
        'schema': listModel
    },
    '400': {
        'description': 'Bad Request'
    },
    '404': {
        'description': 'Sum not found'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};


const fileHTTPStatus = {
    '200': {
        'description': 'Success',
        'schema': sumModel
    },
    '400': {
        'description': 'Bad Request'
    },
    '404': {
        'description': 'Unsupported Media Type'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};


const resultHTTPStatus = {
    '200': {
        'description': 'Success',
        'schema': resultModel
    },
    '400': {
        'description': 'Bad Request'
    },
    '404': {
        'description': 'Sum not found'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};

module.exports = [{
    method: 'GET',
    path: '/',
    config: {
        auth: {
            mode: 'optional'
        },
        handler: handlers.index
    }
},{
    method: 'GET',
    path: '/login',
    config: {
        auth: 'github-oauth',
        handler: handlers.login
    }
},{
    method: 'GET',
    path: '/account',
    config: {
        handler: handlers.account
    }
},{
    method: 'GET',
    path: '/logout',
    config: {
        auth: false,
        handler: handlers.logout
    }
},{
    method: 'GET',
    path: '/license',
    config: {
        auth: false,
        handler: handlers.license
    }
},{
    method: 'PUT',
    path: '/sum/add/{a}/{b}',
    config: {
        auth: false,
        handler: handlers.add,
        description: 'Add',
        tags: ['api', 'reduced'],
        notes: ['Adds together two numbers and return the result. As an option you can have the result return as a binary number.'],
        plugins: {
            'hapi-swagger': {
                responses: resultHTTPStatus
            }
        },
        validate: {
            params: {
                a: Joi.number()
                    .required()
                    .description('the first number'),

                b: Joi.number()
                    .required()
                    .description('the second number')
            },
            headers: Joi.object({
                'x-format': Joi.string()
                    .valid('decimal', 'binary')
                    .default('decimal')
                    .description('return result as decimal or binary')
            }).unknown()
        }
    }
}, {
    method: 'PUT',
    path: '/sum/subtract/{a}/{b}',
    config: {
        auth: false,
        handler: handlers.subtract,
        description: 'Subtract',
        notes: ['Subtracts the second number from the first and return the result'],
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                responses: resultHTTPStatus
            }
        },
        validate: {
            params: {
                a: Joi.number()
                    .required()
                    .description('the first number'),

                b: Joi.number()
                    .required()
                    .description('the second number')
            }
        }
    }
}, {
    method: 'PUT',
    path: '/sum/divide/{a}/{b}',
    config: {
        auth: false,
        handler: handlers.divide,
        description: 'Divide',
        notes: ['Divides the first number by the second and return the result'],
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                responses: resultHTTPStatus
            }
        },
        validate: {
            params: {
                a: Joi.number()
                    .required()
                    .description('the first number - can NOT be 0'),

                b: Joi.number()
                    .required()
                    .description('the second number - can NOT be 0')
            }
        }
    }
}, {
    method: 'PUT',
    path: '/sum/multiple/{a}/{b}',
    config: {
        auth: false,
        handler: handlers.multiple,
        description: 'Multiple',
        notes: ['Multiples the two numbers together and return the result'],
        plugins: {
            'hapi-swagger': {
                responses: resultHTTPStatus
            }
        },
        tags: ['api'],
        validate: {
            params: {
                a: Joi.number()
                    .required()
                    .description('the first number'),

                b: Joi.number()
                    .required()
                    .description('the second number')
            }
        }
    }
}, {
    method: 'GET',
    path: '/store/',
    config: {
        auth: 'jwt',
        handler: handlers.storeList,
        description: 'List sums',
        notes: ['List the sums in the data store'],
        plugins: {
            'hapi-swagger': {
                responses: listHTTPStatus
            }
        },
        tags: ['api', 'reduced', 'one'],
        validate: {
            query: {
                page: Joi.number()
                    .description('the page number'),

                pagesize: Joi.number()
                    .description('the number of items to a page')
            }
        }
    }
}, {
    method: 'GET',
    path: '/store/{id}',
    config: {
        auth: 'jwt',
        handler: handlers.storeItem,
        description: 'Get sum',
        notes: ['Get a sum from the store'],
        plugins: {
            'hapi-swagger': {
                responses: sumHTTPStatus
            }
        },
        tags: ['api', 'reduced', 'two'],
        validate: {
            params: {
                id: Joi.string()
                    .required()
                    .description('the id of the sum in the store')
            }
        }
    }
}, {
    method: 'POST',
    path: '/store/',
    config: {
        auth: 'jwt',
        handler: handlers.storeAdd,
        description: 'Add sum',
        notes: ['Adds a sum to the data store'],
        plugins: {
            'hapi-swagger': {
                responses: sumHTTPStatus,
                payloadType: 'form',
                nickname: 'storeit'
            }
        },
        tags: ['api', 'reduced', 'three'],
        validate: {
            payload: {
                a: Joi.number()
                    .required()
                    .description('the first number'),

                b: Joi.number()
                    .required()
                    .description('the second number'),

                operator: Joi.string()
                    .required()
                    .default('+')
                    .valid(['+','-','/','*'])
                    .description('the opertator i.e. + - / or *'),

                equals: Joi.number()
                    .required()
                    .description('the result of the sum')
            }
        }
    }
}, {
    method: 'PUT',
    path: '/store/{id}',
    config: {
        auth: 'jwt',
        handler: handlers.storeUpdate,
        description: 'Update sum',
        notes: ['Update a sum in our data store'],
        plugins: {
            'hapi-swagger': {
                responses: sumHTTPStatus,
                payloadType: 'form'
            }
        },
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string()
                    .required()
                    .description('the id of the sum in the store')
            },
            payload: {
                a: Joi.number()
                    .required()
                    .description('the first number'),

                b: Joi.number()
                    .required()
                    .description('the second number'),

                operator: Joi.string()
                    .required()
                    .default('+')
                    .valid(['+','-','/','*'])
                    .description('the opertator i.e. + - / or *'),

                equals: Joi.number()
                    .required()
                    .description('the result of the sum')
            }
        }
    }
}, {
    method: 'DELETE',
    path: '/store/{id}',
    config: {
        auth: 'jwt',
        handler: handlers.storeRemove,
        description: 'Delete sums',
        notes: ['Delete a sums from the data store'],
        plugins: {
            'hapi-swagger': {
                responses: sumHTTPStatus
            }
        },
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string()
                    .required()
                    .description('the id of the sum in the store')
            }
        }
    }
}, {
    method: 'POST',
    path: '/store/payload/',
    config: {
        auth: 'jwt',
        handler: handlers.storeAdd,
        description: 'Add sum, with JSON object',
        notes: ['Adds a sum to the data store, using JSON object in payload'],
        plugins: {
            'hapi-swagger': {
                responses: sumHTTPStatus
            }
        },
        tags: ['api', 'reduced', 'three'],
        validate: {
            payload: {
                a: Joi.number()
                    .required()
                    .description('the first number'),

                b: Joi.number()
                    .required()
                    .description('the second number'),

                operator: Joi.string()
                    .required()
                    .default('+')
                    .valid(['+','-','/','*'])
                    .description('the opertator i.e. + - / or *'),

                equals: Joi.number()
                    .required()
                    .description('the result of the sum')
            }
        }
    }
}, {
    method: 'POST',
    path: '/store/file/',
    config: {
        auth: 'jwt',
        handler: handlers.storeAddFile,
        description: 'Add sum, with JSON file',
        notes: ['Adds a sum to the data store, using JSON object in a uploaded file'],
        plugins: {
            'hapi-swagger': {
                responses: fileHTTPStatus,
                payloadType: 'form'
            }
        },
        tags: ['api', 'reduced', 'three'],
        validate: {
            payload: {
                file: Joi.any()
                    .meta({ swaggerType: 'file' })
                    .required()
                    .description('json file with object containing: a, b, operator and equals')
            }
        },
        payload: {
            maxBytes: 1048576,
            parse: true,
            output: 'stream'
        }
    }
}, {
    method: 'GET',
    path: '/{path*}',
    config: {
        auth: false,
        handler: {
            directory: {
                path: './public',
                listing: false,
                index: true
            }
        }
    }
}];


