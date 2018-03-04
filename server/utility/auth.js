'use strict'
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// For local development
// TODO: Replace with database call
const validUsers = [
    {
        email: 'a@b.c',
        password: bcrypt.hashSync('123', 10),
        role: 'volunteer'
    }
]

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
},
function(email, password, done) {
    // TODO: Replace with database call
    const user = validUsers.find(e => e.email === email)
    if (user) {
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
    } else {
        done(null, false)
    }
}
))

module.exports = passport