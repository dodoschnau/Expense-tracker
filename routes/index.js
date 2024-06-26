const express = require('express')
const router = express.Router()


const root = require('./root')
const users = require('./users')
const expenses = require('./expenses')


router.use('/', root)
router.use('/users', users)
router.use('/expenses', expenses)


module.exports = router