const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');

// import Post model
require('../model/Post');
const Post = mongoose.model('posts');

// import Admin model
require('../model/Admin');
const Admin = mongoose.model('admin');


exports.getLogIn = (req, res) => {
  res.render('admin/login');
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: false
  })(req, res, next);
};

exports.getLogout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.getSignUp = (req, res) => {
  res.render('admin/signup');
};

exports.postSignUp = (req, res) => {
  Admin.findOne({
      'username': req.body.username
    })
    .then(user => {
      if (user) {
        res.status(409).send('User already exists');
      } else {
        const newUser = new Admin({
          'username': req.body.username,
          'password': req.body.password
        });
        const saltRounds = 10;
        bcrypt.hash(newUser.password, saltRounds)
          .then(hash => {
            newUser.password = hash;
          })
          .then(() => {
            newUser.save()
              .then(user => {
                console.log(`AdminUser: ${user}`);
                res.redirect('/admin/login');
              })
              .catch(err => {
                console.log(err);
                res.sendStatus(500);
              });
          })
          .catch(err => {
            console.log(`Error: ${err}`);
          });
      }
    })
    .catch((err) => {
      console.log(`Error: ${err.message} - admin.js`);
    });
};

exports.getAdminDashboard = (req, res) => {
  Post.find({})
    // handlebars issue
    .lean()
    .then((posts) => {
      res.render('admin/dashboard', {
        posts
      });
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
};

exports.getAdminPosts = (req, res) => {
  Post.find({})
    .sort('-date')
    // handlebars issue
    .lean()
    .then((posts) => {
      res.render('admin/posts', {
        posts
      });
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
};

exports.getAdminPages = (req, res) => {
  res.render('admin/pages');
};