'use strict'
const Promise = require('bluebird')
const User = require('../models/user.js')

module.exports = {
    retrieveUser: (email) => new Promise((resolve, reject) => {
        User.findByEmail(email)
            .then(user => resolve(user))
            .catch(err => reject(err))
    })
}