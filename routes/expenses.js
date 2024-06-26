const express = require('express')
const router = express.Router()

const db = require('../models')
const Expense = db.Expense
const Category = db.Category


// Get All Expenses
router.get('/', (req, res, next) => {
  const limit = 10
  const page = parseInt(req.query.page) || 1
  const offset = (page - 1) * limit
  const sort = req.query.sort || ''
  const userId = req.user.id

  let whereCondition = { userId };
  if (sort) {
    whereCondition = { ...whereCondition, categoryId: parseInt(sort) }; // Assuming sort value is category ID
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
      if (!rows) {
        req.flash('error', 'Cannot find any data! :(')
        return res.redirect('/expenses')
      }
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
    .catch((error) => {
      error.errorMessage = 'Failed to get this page! :('
      next(error)
    })
})

// Get New Page
router.get('/new', (req, res, next) => {
  const user = req.user

  return Category.findAll({
    attributes: [`id`, `name`, `icon`],
    raw: true
  })
    .then((categories) => {
      const { sort, page } = req.query
      const initialCategory = categories.length > 0 ? categories[0].id : null;
      return res.render('new', { categories, initialCategory, sort, page, user })
    })
    .catch((error) => {
      error.errorMessage = 'Failed to get this page! :('
      next(error)
    })
})

// Get Index Expense Edit Page
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const { sort, page } = req.query
  const userId = req.user.id

  return Promise.all([
    Expense.findByPk(id, {
      attributes: [`id`, `name`, `date`, `amount`, `categoryId`, `userId`],
      raw: true
    }),
    Category.findAll({
      attributes: [`id`, `name`, `icon`],
      raw: true
    })
  ])
    .then(([expense, categories]) => {

      if (!expense) {
        req.flash('error', 'Cannot find any data! :(')
        return res.redirect('/expenses')
      }

      if (expense.userId !== userId) {
        req.flash('error', 'You are not authorized to edit this expense! :(')
        return res.redirect('/expenses')
      }

      expense.date = new Date(expense.date).toISOString().split('T')[0]
      const initialCategory = expense.categoryId
      return res.render('edit', { expense, categories, initialCategory, sort, page })
    })
    .catch((error) => {
      error.errorMessage = 'Failed to get this page! :('
      next(error)
    })
})

// Create A Expense
router.post('/', (req, res, next) => {
  const { name, date, amount, category } = req.body
  const { sort, page } = req.query
  const userId = req.user.id

  return Expense.create({ name, date, amount, categoryId: category, userId })
    .then(() => {
      req.flash('success', 'Created successfully!')
      return res.redirect(`/expenses?sort=${sort}&page=${page}`)
    })
    .catch((error) => {
      error.errorMessage = 'Failed to create this expense! :('
      next(error)
    })
})

// Edit A Expense
router.put('/:id', (req, res, next) => {
  const id = req.params.id
  const { sort, page } = req.query
  const { name, date, amount, category } = req.body
  const userId = req.user.id

  return Expense.findByPk(id, {
    attributes: [`id`, `name`, `date`, `amount`, `categoryId`, `userId`],
    raw: true
  })
    .then((expense) => {
      if (!expense) {
        req.flash('error', 'Cannot find any data! :(')
        return res.redirect('/expenses')
      }

      if (expense.userId !== req.user.id) {
        req.flash('error', 'You are not authorized to edit this expense! :(')
        return res.redirect('/expenses')
      }

      return Expense.update({ name, date, amount, categoryId: category }, { where: { id } })
        .then(() => {
          req.flash('success', 'Updated successfully!')
          return res.redirect(`/expenses?sort=${sort}&page=${page}`)
        })
    })
    .catch((error) => {
      error.errorMessage = 'Failed to update this expense! :('
      next(error)
    })
})

// Delete A Expense
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const { sort, page } = req.query
  const userId = req.user.id

  return Expense.findByPk(id, {
    attributes: [`id`, `name`, `date`, `amount`, `categoryId`, `userId`],
    raw: true
  })
    .then((expense) => {

      if (!expense) {
        req.flash('error', 'Cannot find any data! :(')
        return res.redirect('/expenses')
      }

      if (expense.userId !== req.user.id) {
        req.flash('error', 'You are not authorized to delete this expense! :(')
        return res.redirect('/expenses')
      }

      return Expense.destroy({ where: { id } })
        .then(() => {
          req.flash('success', 'Deleted successfully!')
          return res.redirect(`/expenses?sort=${sort}&page=${page}`)
        })
    })
    .catch((error) => {
      error.errorMessage = 'Failed to delete this expense! :('
      next(error)
    })
})

module.exports = router