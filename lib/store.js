
'use strict';
//	data access layer
const Utils = require('../lib/utilities.js');


const internals = {};


const Store = function (mongoose, connection, options) {

    this.options = options;
    this.Schema = mongoose.Schema;
    this.ObjectId = this.Schema.ObjectId;

    this.StoreSchema = new this.Schema({
        'dbid': this.ObjectId,
        'id': String,
        'a': Number,
        'b': Number,
        'operator': String,
        'equals': Number,
        'created': { type: Date, index: true },
        'modified': { type: Date, index: true }
    });

    this.model = connection.model('store', this.StoreSchema);
};
module.exports = Store;


Store.prototype = {

    // adds a new item
    add: function (item, callback) {

        item.id = Utils.generateID();
        item.created = new Date();

        new this.model(item).save( (err, doc) => {

            if (err){
                console.log(err);
            }
            if (callback) {
                if (doc) {
                    // quick way to simplify object
                    doc = Utils.clone(doc);
                    delete doc._id;
                    delete doc.__v;
                }
                callback(err, doc);
            }
        });
    },


    // append a new item or save an existing one
    update: function  (item, callback) {

        this.get({ id: item.id, dataType: 'internal' }, (err, doc) => {

            if (doc) {
                // update
                doc.a = item.a;
                doc.b = item.b;
                doc.operator = item.operator;
                doc.equals = item.equals;
                doc.modified = new Date();

                doc.save( (err, savedDoc) =>{

                    if (savedDoc) {
                        // quick way to simplify object
                        savedDoc = Utils.clone(savedDoc);
                        delete savedDoc._id;
                        delete savedDoc.__v;
                    }
                    callback(err, savedDoc);
                });
            } else {
                callback(Utils.buildError('404', 'Sum not found'), null);
            }
        });
    },


    // get a single item
    get: function (options, callback) {

        if (options.id) {
            this.model.findOne({ 'id': options.id }, (err, doc) => {

                if (doc) {
                    // dataType is internal or json the default is json
                    if (!options.dataType || options.dataType === 'json') {
                        // quick way to simplify object
                        doc = Utils.clone(doc);
                        delete doc._id;
                        delete doc.__v;
                    }
                    callback(null, doc);
                } else {
                    callback(Utils.buildError('404', 'Sum not found'), null);
                }
            });
        } else {
            callback(Utils.buildError('400', 'No sum id passed to find item'), null);
        }
    },


    // paging query - keep number of object requested low or use mongoosejs stream
    list: function (options, callback) {

        let skipFrom = (options.page * options.pageSize) - options.pageSize;
        let model = this.model;

        if (!options.sort) {
            options.sort = { modified: 1 };
        }

        if (!options.query) {
            options.query = {};
        }

        model.find(options.query)
            .skip(skipFrom)
            .limit(options.pageSize)
            .sort(options.sort)
            .exec( (err, data) => {

                if (err) {
                    callback({ 'error': err });
                } else {
                    model.count(options.query, (err, count) => {

                        if (err) {
                            callback(err, null);
                        } else {
                            let i = data.length;
                            while (i--) {
                                delete data[i]._doc._id;
                                delete data[i]._doc.__v;
                            }
                            // quick way to simplify object
                            data = Utils.clone(data);

                            callback(null, {
                                'items': data,
                                'count': count,
                                'pageSize': options.pageSize,
                                'page': options.page,
                                'pageCount': Math.ceil(count / options.pageSize)
                            });
                        }
                    });
                }
            });
    },


    // remove documents from db collection using a query
    remove: function (options, callback) {

        const self = this;
        if (options.id) {
            this.get(options, (err, data) => {

                if (data) {
                    self.model.remove({ 'id': options.id }, (err) => {

                        callback(err, null);
                    });
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(Utils.buildError('400', 'No sum id passed to find item'), null);
        }
    },


    // remove all documents from db collection
    removeAll: function () {
        this.model.remove({}, (err) => {

            console.log(err);
        });
    }

};
