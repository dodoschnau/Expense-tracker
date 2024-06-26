const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const app = express()
const port = 3000

const messageHandler = require('./middlewares/message-handler.js')
const errorHandler = require('./middlewares/error-handler.js')

const router = require('./routes')

const db = require('./models')
const Expense = db.Expense
const Category = db.Category

const Handlebars = require("handlebars");
const MomentHandler = require("handlebars.moment");
const category = require('./models/category')
MomentHandler.registerHelpers(Handlebars);

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: {
    // need to check if 'a' is equal to 'b'
    eq: (a, b) => a === b,
    getIcon: (categories, selectedCategoryId) => {
      const category = categories.find(cat => cat.id == selectedCategoryId)
      return category ? category.icon : ''
    },
    toString: (value) => value.toString()
  }
}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)


app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})