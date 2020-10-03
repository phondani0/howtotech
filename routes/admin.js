const express = require('express');

const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// import Admin Controllers
const adminControllers = require('../controllers/admin');

const router = express.Router();

const {
  ensureAuthenticated
} = require('../helpers/auth');

// LogIn routes
router.get('/login', adminControllers.getLogIn);

router.post('/login', adminControllers.postLogin);

// LogOut routes
router.get('/logout', ensureAuthenticated, adminControllers.getLogout);

// uncomment the code for creating the new user (Create a new User Routes)

router.get('/signup', adminControllers.getSignUp);

router.post('/signup', adminControllers.postSignUp);

// Admin Dashboard
router.get('/', ensureAuthenticated, adminControllers.getAdminDashboard);

// Admin Posts
router.get('/posts', ensureAuthenticated, adminControllers.getAdminPosts);

// Get Admin Pages
router.get('/pages', ensureAuthenticated, adminControllers.getAdminPages);

module.exports = router;