const express = require('express');
const mongoose = require('mongoose');

// import Post model
require('../model/Post');

const Post = mongoose.model('posts');

const router = express.Router();

router.get('/', (req,res) => {
    Post.find({},(err, doc) => {
        console.log(doc);
    });

    res.status(200).send();
});

router.post('/', (req, res) => {
    
    const post = {
        title: req.body.title,
        allowComments: req.body.allowComments,
        body: req.body.body
    }

    new Post(post)
    .save()
    .then((doc) => {
        console.log(doc);
    })
    .catch((err) => { 
        console.log(err);
    });
});

module.exports = router;