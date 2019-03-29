// Import dotenv module to pull credentials from .env file
require('dotenv').config();

const env = process.env.NODE_ENV || 'dev';

let mongodb_uri;
if (env === 'dev')
    mongodb_uri = 'mongodb://localhost:27017/howtotech';
else
    mongodb_uri = process.env.MONGOLAB_URI

module.exports = {
    mongodb_uri
}