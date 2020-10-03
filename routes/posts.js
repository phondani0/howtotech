const express = require('express');

const postController = require('../controllers/posts');

const {
  ensureAuthenticated
} = require('../helpers/auth');

const router = express.Router();

// add post
router.get('/add', ensureAuthenticated, postController.getAddPost);

// show post
router.get('/show/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((data) => {
      // handlebars issue
      console.log(data);
      console.log(data.images.header_image.data)
      const post = data.toObject();
      // console.log(post);
      // console.log(post.images.header_image.data)
      res.render('post/show', {
        post
      });
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      res.status(500).send();
    });
});


router.get('/edit/:id', ensureAuthenticated, postController.getEditPost);

router.get('/delete/:id', ensureAuthenticated, postController.getDeletePost);

// show post
router.get('/show/:id', postController.getShowPost);

// add new post
router.post('/', ensureAuthenticated, postController.postAddNewPost);

// update post

router.put('/:id', ensureAuthenticated, postController.putUpdatePost);

// delete post
router.delete('/:id', ensureAuthenticated, postController.deleteSinglePost);

// get posts by category
router.get('/', postController.getPostsByCategory);

// Add a new Comment
router.post('/comment/:id', postController.postComment);

// Delete Comment
router.delete('/comment/:id', ensureAuthenticated, postController.deleteComment);

module.exports = router;