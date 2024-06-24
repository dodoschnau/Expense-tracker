const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const app = express()

const db = require('./models')
const Expense = db.Expense
const Category = db.Category

const port = 3000

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
    }
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
  return Category.findAll({
    attributes: [`id`, `name`, `icon`],
    raw: true
  })
    .then((categories) => {
      const initialCategory = categories.length > 0 ? categories[0].id : null;
      return res.render('new', { categories, initialCategory })
    })
    .catch((error) => console.log(error))
})

// Get Index Expense Edit Page
app.get('/expenses/:id/edit', (req, res) => {
  const id = req.params.id
  return Promise.all([
    Expense.findByPk(id, {
      attributes: [`id`, `name`, `date`, `amount`, `categoryId`],
      raw: true
    }),
    Category.findAll({
      attributes: [`id`, `name`, `icon`],
      raw: true
    })
  ])
    .then(([expense, categories]) => {
      expense.date = new Date(expense.date).toISOString().split('T')[0]
      const initialCategory = expense.categoryId
      res.render('edit', { expense, categories, initialCategory })
    })
    .catch((error) => console.log(error))
})

// Create A Expense
app.post('/expenses', (req, res) => {
  const { name, date, amount, category } = req.body
  return Expense.create({ name, date, amount, categoryId: category })
    .then(() => res.redirect('/expenses'))
    .catch((error) => console.log(error))
})

// Edit A Expense
app.put('/expenses/:id', (req, res) => {
  const id = req.params.id
  const { name, date, amount, category } = req.body
  return Expense.update({ name, date, amount, categoryId: category }, { where: { id } })
    .then(() => res.redirect('/expenses'))
    .catch((error) => console.log(error))
})

// Delete A Expense
app.delete('/expenses/:id', (req, res) => {
  const id = req.params.id
  return Expense.destroy({ where: { id } })
    .then(() => res.redirect('/expenses'))
    .catch((error) => console.log(error))
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})