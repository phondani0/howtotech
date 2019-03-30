const express = require('express');
const mongoose = require('mongoose');

// import Post model
require('../model/Post');

const Post = mongoose.model('posts');

const router = express.Router();

// get posts
router.get('/', (req, res) => {
    Post.find({})
        .sort('-date')
        .then((posts) => {
            // console.log(doc);
            res.render('index/index', {
                'posts': posts
            });
        })
        .catch((err) => {
            res.status(404).send();
        })
});

router.get('/admin', (req, res) => {
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

router.get('/admin/posts', (req, res) => {
    Post.find({})
        .then((posts) => {
            res.render('admin/posts', {
                posts
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
});

module.exports = router;