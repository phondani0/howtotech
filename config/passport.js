const mongoose = require('mongoose');
const localStrategy = require('passport-local');

// Admin model
require('../model/Admin');
const Admin = mongoose.model('admin');

module.exports = function (passport) {
    passport.use(new localStrategy((username, password, done) => {
        Admin.findOne({
            username
        }, (err, user) => {
            console.log('here');
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('Incorrect Username.');
                return done(null, false, {
                    message: 'Incorrect Username.'
                });
            }
            if (!user.password === password) {
                console.log('Incorrect Password.');
                return done(null, false, {
                    message: 'Incorrect Password.'
                });
            }
            return done(null, user);
        });
    }));
}