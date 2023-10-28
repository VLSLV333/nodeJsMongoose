const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoose = require('mongoose');
const mongoLink = require('./secret/mongoLink');

const show404 = require('./controllers/404').show404;

const connectToMongo = require('./util/databaseMongoDb').connectToMongo;

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('653787b412fdc1cd464f0534')
    .then((user) => {
      req.user = new User(user.name, user.email, user._id, user.cart); // by this we create new field in req object, so req.user was undefined, now we've stored user from our db
      //  in our req object req.user = user. Also the 'user' we've saved her is the object created by sequelize with all it's methods
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use('/', show404);

mongoose
  .connect(mongoLink)
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
