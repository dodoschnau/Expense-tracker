const express = require('express')
const router = express.Router()

const db = require('../models')
const { where } = require('sequelize')
const User = db.User

// Register
router.post('/', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body

  if (!name || !email || !password) {
    req.flash('error', 'Please fill in all fields.')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Password and Confirm Password do not match.')
    return res.redirect('back')
  }

  return User.count({ where: { email } })
    .then((count) => {
      if (count > 0) {
        req.flash('error', 'Email has already existed.')
        return
      }
      return User.create({ name, email, password })
    })
    .then((user) => {
      if (!user) {
        return res.redirect('back')
      }
      req.flash('success', 'User created successfully.')
      return res.redirect('/login')
    })
    .catch((error) => {
      error.errorMessage = 'Failed to Register!'
      next(error)
    })
})


module.exports = router