const express = require('express')
const router = express.Router()


// Register
router.post('/', (req, res) => {
  res.send('POST register')
})


module.exports = router