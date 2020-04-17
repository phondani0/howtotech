const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt');

// import Post model
require('../model/Post');
const Post = mongoose.model('posts');

// import Admin model
require('../model/Admin');
const Admin = mongoose.model('admin');

const router = express.Router();

const {
  ensureAuthenticated
} = require('../helpers/auth');

router.get('/login', (req, res) => {
  res.render('admin/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: false
  })(req, res, next);
});

// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

// uncomment the code for creating the new user

// router.get('/signup', (req, res) => {
//     res.render('admin/signup');
// });

// router.post('/signup', (req, res) => {
//   Admin.findOne({
//       'username': req.body.username
//     })
//     .then(user => {
//       if (user) {
//         res.status(409).send('User already exists');
//       } else {
//         const newUser = new Admin({
//           'username': req.body.username,
//           'password': req.body.password
//         });
//         const saltRounds = 10;
//         bcrypt.hash(newUser.password, saltRounds)
//           .then(hash => {
//             newUser.password = hash;
//           })
//           .then(() => {
//             newUser.save()
//               .then(user => {
//                 console.log(`AdminUser: ${user}`);
//                 res.redirect('/admin/login');
//               })
//               .catch(err => {
//                 console.log(err);
//                 res.sendStatus(500);
//               });
//           })
//           .catch(err => {
//             console.log(`Error: ${err}`);
//           });
//       }
//     })
//     .catch((err) => {
//       console.log(`Error: ${err.message} - admin.js`);
//     });
// });

router.get('/', ensureAuthenticated, (req, res) => {
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
});

router.get('/posts', ensureAuthenticated, (req, res) => {
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
});

// Get Pages
router.get('/pages', ensureAuthenticated, (req, res) => {
  res.render('admin/pages');
});

module.exports = router;