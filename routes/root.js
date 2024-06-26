const express = require('express')
const router = express.Router()

const db = require('../models')
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
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    req.flash('error', 'Please fill in all fields.')
    return res.redirect('back')
  }

  res.send('POST Login')
})

// POST Logout
router.post('/logout', (req, res) => {
  res.send('POST Logout')
})


module.exports = router