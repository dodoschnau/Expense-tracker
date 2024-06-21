const express = require('express')
const { engine } = require('express-handlebars')

const app = express()

const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/expenses')
})

app.get('/expenses', (req, res) => {
  res.render('index')
})

app.get('/expenses/new', (req, res) => {
  res.render('new')
})

app.get('/expenses/:id/edit', (req, res) => {
  const id = req.params.id
  res.render(`edit`)
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