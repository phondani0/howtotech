const express = require('express');
const mongoose = require('mongoose');

// import Post model
require('../model/Post');

const Post = mongoose.model('posts');

const router = express.Router();

// add post
router.get('/add', (req, res) => {
    res.render('posts/add');
});

// add new post
router.post('/', (req, res) => {
    let allowComments = false;

    if (req.body.allowComments == 'on') {
        allowComments = true;
    }

    const post = {
        'title': req.body.title,
        'allowComments': allowComments,
        'body': req.body.body
    }
    new Post(post)
        .save()
        .then((doc) => {
            console.log(doc);
            res.send(doc);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

// get posts
router.get('/', (req, res) => {
    Post.find({})
        .sort('-date')
        .then((doc) => {
            console.log(doc);
            res.send(doc);
        })
        .catch((err) => {
            res.status(404).send();
        })
});

module.exports = router;