const express = require('express');
const mongoose = require('mongoose');

// import Post model
require('../model/Post');

const Post = mongoose.model('posts');

const router = express.Router();

// get posts
router.get('/', (req, res) => {
    Post.find({
            status: 'published'
        })
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

module.exports = router;