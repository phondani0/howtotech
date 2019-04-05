const express = require('express');
const mongoose = require('mongoose');

// import Post model
require('../model/Post');

const Post = mongoose.model('posts');

const router = express.Router();

// add post
router.get('/add', (req, res) => {
    res.render('post/add');
});

router.get('/edit/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            // console.log(post);
            res.render('post/edit', {
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
            res.render('post/delete', {
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

// show post
router.get('/show/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            res.render('post/show', {
                post
            });
        })
        .catch((err) => {
            console.log(`Error: ${err.message}`);
            res.status(500).send();
        });
});

// add new post
router.post('/', (req, res) => {
    let allowComments = false;

    if (req.body.allowComments == 'on') {
        allowComments = true;
    }

    const post = {
        'title': req.body.title,
        'body': req.body.body,
        'category': req.body.category,
        'status': req.body.status,
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
        category: req.body.category,
        status: req.body.status,
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