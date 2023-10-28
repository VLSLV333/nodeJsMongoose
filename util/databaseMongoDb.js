const mongoDb = require('mongodb');
const MongoClient = mongoDb.MongoClient;

const linkToMongo = require('../secret/mongoLink');

let _db = null; // _ at the begining means that this variable will only be used internally in this file

const connectToMongo = (callBack) => {
  MongoClient.connect(linkToMongo)
    .then((client) => {
      _db = client.db('shop');
      callBack();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No data base found:(';
};

exports.connectToMongo = connectToMongo;
exports.getDb = getDb;
