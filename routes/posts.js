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

router.get('/edit/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            console.log(post);
            res.render('posts/edit', {
                post
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
});

/* ===========================
========= API-ROUTES ========= 
=========================== */

// add new post
router.post('/', (req, res) => {
    let allowComments = false;

    if (req.body.allowComments == 'on') {
        allowComments = true;
    }

    const post = {
        'title': req.body.title,
        'body': req.body.body,
        'allowComments': allowComments
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

router.put('/:id', (req, res) => {
    const updatedPost = {
        title: req.body.title,
        body: req.body.body,
        allowComments: false
    }

    if (req.body.allowComments === 'on') {
        updatedPost.allowComments = true
    }

    Post.findById(req.params.id)
        .then((doc) => {
            console.log(`doc:  ${doc}`);
            doc.updateOne(updatedPost, (err) => {
                if (!err) {
                    return res.status(200).send();
                }
                //else handle error @TODO
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
});

module.exports = router;