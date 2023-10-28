const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('./admin/edit-product', {
    title: 'Add Product BOSH ejs',
    path: '/admin/add-product',
    editing: false,
    prod: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const newProduct = new Product(
    req.body.title,
    req.body.price,
    req.body.imageUrl,
    req.body.description,
    null,
    req.user._id
  );
  newProduct
    .save()
    .then((result) => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then((arrWithProdData) => {
      res.render('./admin/products.ejs', {
        prods: arrWithProdData,
        title: 'Admin Products BOSH',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(req.params.productID)
    .then((prod) => {
      if (!prod) {
        return res.redirect('/');
      }
      res.render('./admin/edit-product', {
        title: 'Edit Product BOSH',
        path: '/admin/edit-product',
        editing: editMode,
        prod: prod,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.imageUrl,
    req.body.description,
    req.query.idToUpdate,
    req.user._id
  );
  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  // add deletion in cart aswell after deleting in admim
  Product.deleteById(req.body.idToDelete)
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};
