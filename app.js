const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/expenses', (req, res) => {
  res.send('Get All Expenses.')
})

app.get('/expenses/new', (req, res) => {
  res.send('Get New Expense Page.')
})

app.get('/expenses/:id', (req, res) => {
  const id = req.params.id
  res.send(`Get 'id: ${id}' Expense Page.`)
})

app.get('/expenses/:id/edit', (req, res) => {
  const id = req.params.id
  res.send(`Get Edit 'id: ${id}' Expense Page.`)
})

app.post('/expenses', (req, res) => {
  res.send('Create A Expense Record.')
})

app.put('/expenses/:id', (req, res) => {
  const id = req.params.id
  res.send('Edit A Expense Record.')
})

app.delete('/expenses/:id', (req, res) => {
  const id = req.params.id
  res.send('Delete A Expense Record.')
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})