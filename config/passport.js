const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user || password !== user.password) {
        return done(null, false, { message: 'Incorrect username or password.' })
      }
      return done(null, user)
    })
    .catch((error) => {
      error.errorMessage = 'Failed to Login!'
      return done(error)
    })
}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  done(null, { id, name, email })
});

module.exports = passport