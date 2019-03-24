const express = require('express');
const mongoose = require('mongoose');

// import Post model
require('../model/Post');

const Post = mongoose.model('posts');

const router = express.Router();

router.get('/',(req,res)=>{
    res.status(200).send();
});

module.exports = router;