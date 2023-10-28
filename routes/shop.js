const express = require('express');

const router = express.Router();

const shopControler = require('../controllers/shop');

router.get('/', shopControler.getProducts);

router.get('/product-list', shopControler.showAllProducts);

router.get('/products/:productID', shopControler.getProductDetails);

router.get('/cart', shopControler.getCart);

router.post('/cart', shopControler.postCart);

router.post('/cart/delete-item/:itemID', shopControler.postDeleteCartItem);

router.get('/orders', shopControler.getOrders);

router.post('/create-order', shopControler.postOrder);

module.exports = router;
