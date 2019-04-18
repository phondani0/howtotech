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
});

/*============================
========= API-ROUTES ========= 
============================*/

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
        'category': req.body.category.toLowerCase(),
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
        category: req.body.category.toLowerCase(),
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

// get posts by category
router.get('/', (req, res) => {
    Post.find({
            status: 'published',
            category: req.query.category
        })
        .sort('-date')
        .then((posts) => {
            // console.log(doc);
            res.render('post/category', {
                'posts': posts
            });
        })
        .catch((err) => {
            res.status(404).send();
        })
});

router.post('/comment/:id', (req, res) => {
    const newComment = {
        commentBody: req.body.commentBody
    }
    Post.findOneAndUpdate({
            _id: req.params.id,
            allowComments: true
        }, {
            $push: {
                comments: {
                    $each: [newComment],
                    $position: 0
                }
            }
        })
        .then((post) => {
            res.redirect(`/posts/show/${post.id}`);
        })
        .catch((err) => {
            console.log(`Error: ${err.message}`);
            res.status(500).send();
        });
});

router.delete('/comment/:id', (req, res) => {
    Post.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                comments: {
                    _id: req.query.c_id
                }
            }
        })
        .then((post) => {
            res.redirect(`/posts/show/${post.id}`);
        })
        .catch((err) => {
            console.log(`Error: ${err.message}`);
            res.status(500).send();
        });
});

module.exports = router;