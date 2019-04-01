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
            // console.log(post);
            res.render('posts/edit', {
                post
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
});

router.get('/delete/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            console.log(post);
            res.render('posts/delete', {
                post
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
})

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
            res.redirect('/admin/posts');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

// update post
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
                    return res.redirect('/admin/posts');
                }
                //else handle error @TODO
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
});

// delete post
router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => {
            console.log('Post deleted successfully');
            res.redirect('/admin/posts');
        })
        .catch((err) => {
            res.status(500).send();
        })
});

module.exports = router;