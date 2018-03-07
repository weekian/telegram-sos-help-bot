'use strict'
const Promise = require('bluebird')

module.exports = {
    verifyPassword: (userPassword, inputPassword) => new Promise((resolve, reject) => {
        resolve(userPassword === inputPassword)
    })
}