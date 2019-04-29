const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

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
        session: false,
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: false
    })(req, res, next);
});

router.get('/signup', (req, res) => {
    res.render('admin/signup');
});

router.post('/signup', (req, res) => {
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
                newUser.save()
                    .then(user => {
                        res.redirect('/admin/login');
                    })
                    .catch(err => {
                        console.log(err);
                        res.sendStatus(500);
                    });
            }
        });
});

router.get('/', ensureAuthenticated, (req, res) => {
    Post.find({})
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