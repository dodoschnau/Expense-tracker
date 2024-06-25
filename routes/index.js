const express = require('express')
const router = express.Router()

const expenses = require('./expenses')

router.use('/expenses', expenses)

router.get('/', (req, res) => {
  res.redirect('/expenses')
})

module.exports = router