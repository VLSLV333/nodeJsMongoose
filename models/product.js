const mongoDb = require('mongodb');
const getDb = require('../util/databaseMongoDb').getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    (this.title = title),
      (this.price = price),
      (this.imageUrl = imageUrl),
      (this.description = description),
      (this._id = id ? new mongoDb.ObjectId(id) : null),
      (this.userId = userId);
  }

  save() {
    const db = getDb();
    let dbOperation = null;

    if (this._id) {
      dbOperation = db.collection('products').updateOne(
        { _id: this._id },
        {
          $set: {
            title: this.title,
            price: this.price,
            imageUrl: this.imageUrl,
            description: this.description,
          },
        }
      );
    } else {
      dbOperation = db.collection('products').insertOne(this);
    }
    return dbOperation.then().catch((err) => console.log(err));
  }
  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }
  static findById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .find({
        _id: new mongoDb.ObjectId(productId),
      })
      .next() // returns next document fetched by find (we only have 1 document with given ID, so thats what we need)
      .then((prod) => {
        return prod;
      })
      .catch((err) => console.log(err));
  }
  static deleteById(productID) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({
        _id: new mongoDb.ObjectId(productID),
      })
      .then()
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
