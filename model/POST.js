const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    allowComments : {
        type: Boolean,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    }
});

mongoose.model('posts', postSchema, 'posts');