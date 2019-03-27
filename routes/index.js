const express = require('express');
const mongoose = require('mongoose');

// import Post model
require('../model/Post');

const Post = mongoose.model('posts');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/posts');
});

router.get('/dashboard', (req, res) => {
    Post.find({})
        .then((posts) => {
            // console.log(posts);
            res.render('index/dashboard', {
                posts
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
});

module.exports = router;