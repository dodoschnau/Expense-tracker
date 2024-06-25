const express = require('express')
const router = express.Router()

const db = require('../models')
const Expense = db.Expense
const Category = db.Category


// Get All Expenses
router.get('/', (req, res) => {
  const limit = 10
  const page = parseInt(req.query.page) || 1
  const offset = (page - 1) * limit
  const sort = req.query.sort || ''

  let whereCondition = {};
  if (sort) {
    whereCondition = { categoryId: parseInt(sort) }; // Assuming sort value is category ID
  }

  return Promise.all([
    Expense.findAndCountAll({
      include: [{
        model: Category,
        attributes: [`id`, `name`, `icon`]
      }],
      where: whereCondition,
      attributes: [`id`, `name`, `date`, `amount`, `categoryId`],
      offset,
      limit,
      raw: true,
      nest: true
    }),
    Category.findAll({
      attributes: [`id`, `name`, `icon`],
      raw: true
    }),
    Expense.sum('amount', { where: whereCondition })
  ])
    .then(([{ count, rows }, categories, totalAmount]) => {
      const totalPages = Math.ceil(count / limit)
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
      return res.render('index', {
        expenses: rows,
        categories,
        totalAmount,
        page,
        pages,
        prev: page > 1 ? page - 1 : 1,
        next: page < totalPages ? page + 1 : totalPages,
        totalPages,
        sort
      })
    })
    .catch((error) => console.log(error))
})

// Get New Page
router.get('/new', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
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
router.post('/', (req, res) => {
  const { name, date, amount, category } = req.body
  return Expense.create({ name, date, amount, categoryId: category })
    .then(() => {
      req.flash('success', 'Created successfully!')
      return res.redirect('/expenses')
    })
    .catch((error) => console.log(error))
})

// Edit A Expense
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, amount, category } = req.body
  return Expense.update({ name, date, amount, categoryId: category }, { where: { id } })
    .then(() => {
      req.flash('success', 'Updated successfully!')
      res.redirect('/expenses')
    })
    .catch((error) => console.log(error))
})

// Delete A Expense
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Expense.destroy({ where: { id } })
    .then(() => {
      req.flash('success', 'Deleted successfully!')
      res.redirect('/expenses')
    })
    .catch((error) => console.log(error))
})

module.exports = router