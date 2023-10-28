const express = require('express');

const router = express.Router();

const adminContolers = require('../controllers/admin');

router.get('/products', adminContolers.getAdminProducts);

router.get('/add-product', adminContolers.getAddProduct);

router.post('/add-product', adminContolers.postAddProduct);

router.get('/edit-product/:productID', adminContolers.getEditProduct);

router.post('/edit-product', adminContolers.postEditProduct)

router.post('/delete-product', adminContolers.postDeleteProduct)

module.exports = router;
