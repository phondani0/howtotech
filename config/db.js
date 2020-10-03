// Import dotenv module to pull credentials from .env file
require('dotenv').config();

module.exports = {
    mongodb_uri:process.env.MONGOLAB_URI
}