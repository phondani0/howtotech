const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

// import Post model
require('../model/Post');

const {
    ensureAuthenticated
} = require('../helpers/auth');

const Post = mongoose.model('posts');

const router = express.Router();

// config multer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

// add post
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('post/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
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

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
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
router.post('/', ensureAuthenticated, upload.single('header_img'), (req, res) => {
    let allowComments = false;
    if (req.body.allowComments == 'on') {
        allowComments = true;
    }
    const allowTypes = ['image/jpeg', 'image/png'];

    let headerImg;
    if (req.file) {
        const headerImgBuffer = req.file && allowTypes.indexOf(req.file.mimetype) > -1 && req.file.fieldname === 'header_img' && req.file.buffer ? req.file.buffer : '';

        headerImg = {
            data: headerImgBuffer,
            contentType: req.file.mimetype
        }
    }
    const post = {
        'title': req.body.title,
        'body': req.body.body,
        'images': {
            header_image: headerImg
        },
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
router.put('/:id', ensureAuthenticated, upload.single('header_img'), (req, res) => {
    console.log(req.files);
    console.log(req.body);
    let allowComments = false;
    if (req.body.allowComments == 'on') {
        allowComments = true;
    }
    const allowTypes = ['image/jpeg', 'image/png'];
    let headerImg;

    if (req.file) {
        const headerImgBuffer = req.file && allowTypes.indexOf(req.file.mimetype) > -1 && req.file.fieldname === 'header_img' && req.file.buffer ? req.file.buffer : '';
        headerImg = {
            data: headerImgBuffer,
            contentType: req.file.mimetype
        }
    } else {
        console.log('headerImg not found');
    }

    const updatedPost = {
        'title': req.body.title,
        'body': req.body.body,
        'images': {
            header_image: headerImg
        },
        'category': req.body.category.toLowerCase(),
        'status': req.body.status,
        'allowComments': allowComments
    }

    Post.findById(req.params.id)
        .then((doc) => {
            console.log(`doc:  ${doc}`);
            doc.updateOne(updatedPost, (err) => {
                if (!err) {
                    return res.redirect('/admin/posts');
                } else {
                    console.log(`Error: ${err}`);
                }
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        })
});

// delete post
router.delete('/:id', ensureAuthenticated, (req, res) => {
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
        commentBody: req.body.commentBody,
        commentUser: {
          name: req.body.name,
          email: req.body.email
        }
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

router.delete('/comment/:id', ensureAuthenticated, (req, res) => {
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
