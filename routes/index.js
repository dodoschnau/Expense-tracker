const express = require('express')
const router = express.Router()


const root = require('./root')
const users = require('./users')
const expenses = require('./expenses')
const authHandler = require('../middlewares/auth-handler')


router.use('/', root)
router.use('/users', users)
router.use('/expenses', authHandler, expenses)


module.exports = router