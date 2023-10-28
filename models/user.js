const mongoDb = require('mongodb');
const { or } = require('sequelize');
const getDb = require('../util/databaseMongoDb').getDb;

const ObjectId = mongoDb.ObjectId;

class User {
  constructor(username, email, id, cart) {
    (this.name = username),
      (this.email = email),
      (this._id = id),
      (this.cart = cart ? cart : { items: [] }); // cart = {items: []}
  }
  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product, prodQuantity) {
    let updatedCart = null;
    const cartProductIndex = this.cart.items.findIndex((prod) => {
      return prod.productId.toString() === product._id.toString();
    });

    if (cartProductIndex >= 0) {
      let toUpdateCartItems = [...this.cart.items];
      toUpdateCartItems[cartProductIndex].quantity += +prodQuantity;
      updatedCart = { items: toUpdateCartItems };
    } else {
      updatedCart = {
        items: [
          ...this.cart.items,
          { productId: new ObjectId(product._id), quantity: +prodQuantity },
        ],
      };
    }

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  removeFromCart(prodId) {
    const db = getDb();
    let updatedCart = {
      items: [...this.cart.items].filter(
        (prod) => prod.productId.toString() !== prodId.toString()
      ),
    };
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((prod) => {
      return prod.productId;
    });

    // gives back cursor containg all documents with Id's matching those in array
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((productsArr) => {
        // check if our cart contains products, that were already deleted from DB by admin, if so - remove them from this user's cart aswell
        productIds.forEach((prodIdInCart) => {
          let prodIdStillInDB = false;
          productsArr.forEach((prod) => {
            if (prodIdInCart.toString() === prod._id.toString()) {
              prodIdStillInDB = true;
            }
          });
          if (!prodIdStillInDB) {
            let newCartItems = [...this.cart.items].filter(
              (prodIdToDelete) =>
                prodIdToDelete.productId.toString() !== prodIdInCart.toString()
            );
            // remove item from this cart
            this.cart.items = newCartItems;
            // remove item from db user's cart
            db.collection('users').updateOne(
              { _id: new ObjectId(this._id) },
              { $set: { cart: { items: newCartItems } } }
            );
          }
        });

        return productsArr.map((prod) => {
          return {
            ...prod,
            quantity: this.cart.items.find(
              (product) => product.productId.toString() === prod._id.toString()
            ).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((cartArr) => {
        const totalOrderPrice = cartArr.reduce(
          (acc, item) => +item.quantity * +item.price + acc,
          0
        );
        const order = {
          items: [...cartArr].map((item) => {
            return {
              _id: item._id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            };
          }),
          userWhoMadeOrder: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
          totalOrderPrice,
        };
        return db.collection('orders').insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'userWhoMadeOrder._id': new ObjectId(this._id) })
      .toArray();
  }
  getName() {
    return this.name;
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) }) // in case we are sure we will only receive one document
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
