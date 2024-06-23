const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const app = express()

const db = require('./models')
const Expense = db.Expense

const port = 3000

const Handlebars = require("handlebars");
const MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);

app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: {
    // need to check if 'a' is equal to 'b'
    eq: (a, b) => a === b
  }
}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.redirect('/expenses')
})

// Get All Expenses
app.get('/expenses', (req, res) => {
  return Expense.findAll({
    attributes: [`id`, `name`, `date`, `amount`],
    raw: true
  })
    .then((expenses) => res.render('index', { expenses }))
    .catch((error) => console.log(error))
})

// Get New Page
app.get('/expenses/new', (req, res) => {
  res.render('new')
})

// Get Index Expense Edit Page
app.get('/expenses/:id/edit', (req, res) => {
  const id = req.params.id
  return Expense.findByPk(id, {
    attributes: [`id`, `name`, `date`, `amount`],
    raw: true
  })
    .then((expense) => {
      expense.date = new Date(expense.date).toISOString().split('T')[0]
      res.render('edit', { expense })
    })
    .catch((error) => console.log(error))
})

// Create A Expense
app.post('/expenses', (req, res) => {
  const { name, date, amount } = req.body
  return Expense.create({ name, date, amount })
    .then(() => res.redirect('/expenses'))
    .catch((error) => console.log(error))
})

// Edit A Expense
app.put('/expenses/:id', (req, res) => {
  const id = req.params.id
  const { name, date, amount } = req.body
  return Expense.update({ name, date, amount }, { where: { id } })
    .then(() => res.redirect('/expenses'))
    .catch((error) => console.log(error))
})

// Delete A Expense
app.delete('/expenses/:id', (req, res) => {
  const id = req.params.id
  res.send('Delete A Expense Record.')
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})