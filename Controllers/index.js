const mongoose = require('mongoose');

// import Post model
require('../model/Post');
const Post = mongoose.model('posts');

exports.getIndex = (req, res, next) => {
  Post.find({
      status: 'published'
    })
    .sort('-date')
    // handlebars issue
    .lean()
    .then((posts) => {
      console.log(posts);
      res.render('index/index', {
        'posts': posts
      });
    })
    .catch((err) => {
      res.status(404).send();
    })
};