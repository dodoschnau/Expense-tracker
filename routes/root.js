const express = require('express')
const router = express.Router()

const db = require('../models')
const passport = require('passport')
const User = db.User


router.get('/', (req, res) => {
  res.redirect('/expenses')
})

// Get Login Page
router.get('/login', (req, res) => {
  res.render('login')
})

// Get Register Page
router.get('/register', (req, res) => {
  res.render('register')
})

// POST Login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Please fill in your username and password.');
    return res.redirect('/login');
  }
  next();
},
  passport.authenticate('local', {
    successRedirect: '/expenses',
    failureRedirect: '/login',
    failureFlash: true
  }))

// POST Logout
router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/login');
  })
})


module.exports = router