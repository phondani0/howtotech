const mongoose = require('mongoose');
const fileHelper = require('../util/fileHelper');
// import Post model
require('../model/Post');
const Post = mongoose.model('posts');

const {
  cloudinaryUpload
} = require('../util/imageUpload');

exports.getAddPost = (req, res) => {
  res.render('post/add');
};

exports.getEditPost = (req, res) => {
  Post.findById(req.params.id)
    .then((data) => {
      console.log(data);
      // handlebars issue
      const post = data.toObject();
      res.render('post/edit', {
        post
      });
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
};

exports.getDeletePost = (req, res) => {
  Post.findById(req.params.id)
    .then((data) => {
      console.log(data);
      // handlebars issue
      const post = data.toObject();
      res.render('post/delete', {
        post
      });
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
};

exports.getShowPost = (req, res) => {
  console.log(1)
  Post.findById(req.params.id)
    .then((data) => {
      const post = data.toObject();
      res.render('post/show', {
        'post': post
      });
    })
    .catch((err) => {
      console.log(`Error1: ${err.message}`);
      res.status(500).send();
    });
};

exports.postAddNewPost = async (req, res) => {
  console.log(req.body);
  let allowComments = false;
  if (req.body.allowComments == 'on') {
    allowComments = true;
  }
  // const allowTypes = ['image/jpeg', 'image/png'];

  const image = req.file;
  let imageUrl;

  try {

    const uploadResult = await cloudinaryUpload(image);
    console.log(uploadResult);
    imageUrl = uploadResult.secure_url ? uploadResult.secure_url : '';
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
  // if (!image) {
  //   imageUrl = 'images/not-found.jpg';
  // } else {
  //   imageUrl = image.path.replace(/\\/g, '/');
  // }

  const post = new Post({
    'title': req.body.title,
    'body': req.body.body,
    'images': {
      'imageUrl': imageUrl
    },
    'category': req.body.category ? req.body.category.toLowerCase() : 'ALL',
    'status': req.body.status,
    'allowComments': allowComments
  });

  post
    .save()
    .then((doc) => {
      console.log(doc);
      res.redirect('/admin/posts');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
};

exports.putUpdatePost = async (req, res) => {
  const postId = req.params.id;

  const updatedTitle = req.body.title;
  const updatedbody = req.body.body;
  const updatedcategory = req.body.category;
  const updatedstatus = req.body.status;
  const image = req.file;
  let allowComments = false;

  if (req.body.allowComments == 'on') {
    allowComments = true;
  }

  Post.findById(postId)
    .then(async post => {
      post.title = updatedTitle;
      post.body = updatedbody;
      post.category = updatedcategory;
      post.status = updatedstatus;
      post.allowComments = allowComments;

      if (image) {
        // fileHelper.deleteImage(post.images.imageUrl);
        cloudinaryUpload(image)
          .then((result) => {
            console.log(result);
            imageUrl = uploadResult.secure_url ? uploadResult.secure_url : '';
            post.images.imageUrl = imageUrl;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            return post.save()
              .then(data => {
                console.log('Post Updated Sucessfully');
                res.redirect('/admin/posts');
              })
          });
      } else {
        return post.save()
          .then(result => {
            console.log('Post Updated Sucessfully');
            res.redirect('/admin/posts');
          })
      }
    })
    .catch(err => {
      console.log(`Error : ${err}`);
      res.redirect('/');
    });
};

exports.getPostsByCategory = (req, res) => {
  console.log(req.query.category);
  Post.find({
      status: 'published',
      category: req.query.category
    })
    .sort('-date')
    // handlebars issue
    .lean()
    .then((posts) => {
      console.log(posts);
      res.render('post/category', {
        'posts': posts
      });
      console.log()
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send();
    })
};

exports.deleteSinglePost = (req, res) => {
  const postId = req.params.id;
  Post.findById(postId)
    .then(post => {
      // if (post.images.imageUrl !== 'images/not-found.jpg') {
      //   fileHelper.deleteImage(post.images.imageUrl);
      // }
      return Post.deleteOne({
        _id: postId
      });
    })
    .then(() => {
      console.log('Post deleted successfully');
      res.redirect('/admin/posts');
    })
    .catch((err) => {
      res.status(500).send();
    });
};

exports.postComment = (req, res) => {
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
};

exports.deleteComment = (req, res) => {
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
};