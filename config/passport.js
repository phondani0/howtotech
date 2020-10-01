const mongoose = require('mongoose');
const localStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

// Admin model
require('../model/Admin');
const Admin = mongoose.model('admin');

module.exports = function (passport) {
    passport.use(new localStrategy((username, password, done) => {
        Admin.findOne({
            username
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('Incorrect Username.');
                return done(null, false);
            }
            bcrypt.compare(password, user.password)
                .then((res) => {
                    if (res) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
                .catch((err) => {
                    console.log(`Error: ${err}`);
                });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        Admin.findById(id, (err, user) => {
            done(err, user);
        });
    });
}