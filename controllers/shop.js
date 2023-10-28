const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('./shop/index.ejs', {
        prods: products,
        title: 'Products ejs',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const productID = req.params.productID;
  Product.findById(productID)
    .then((prod) => {
      res.render('./shop/product-detail.ejs', {
        title: `${prod.title} details BOSH`,
        path: '/products',
        prod: prod,
      });
    })
    .catch((err) => console.log(err));
};

exports.showAllProducts = (req, res, next) => {
  Product.fetchAll()
    .then((prods) => {
      res.render('./shop/product-list.ejs', {
        prods: prods,
        title: 'Vlad Shop ejs',
        path: '/product-list',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((productsArr) => {
      let totalPrice = productsArr.reduce(
        (acc, prod) => +prod.quantity * +prod.price + acc,
        0
      );
      res.render('./shop/cart.ejs', {
        title: 'Cart BOSJ ejs',
        path: '/cart',
        prods: productsArr,
        totalPrice: totalPrice,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productIdToAddToCart = req.body.productId;
  let productQuantityToAddToCart = +req.body.quantity;
  Product.findById(productIdToAddToCart)
    .then((prod) => req.user.addToCart(prod, productQuantityToAddToCart))
    .then((result) => {
      console.log(result), res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
  req.user
    .removeFromCart(req.params.itemID)
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => res.redirect('/orders'))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const userName = req.user.getName();
  req.user
    .getOrders()
    .then((orders) => {
      const totalPriceForAllOrders = orders.reduce(
        (acc, prod) => prod.totalOrderPrice + acc,
        0
      );
      res.render('./shop/orders.ejs', {
        title: 'Orders BOSH ejs',
        path: '/orders',
        orders: orders,
        totalPriceForAllOrders: totalPriceForAllOrders,
        userName,
      });
    })
    .catch((err) => console.log(err));
};
