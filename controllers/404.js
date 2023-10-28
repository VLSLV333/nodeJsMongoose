exports.show404 = (req, res, next) => {
  res.status(404).render('404', { title: 'Wrong Page BOSH ejs', path: '404' });
};
