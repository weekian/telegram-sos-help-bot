'use strict'
const Promise = require('bluebird')

const validUsers = [
    {
        email: 'a@b.c',
        password: '123',
        accessLevel: 1
    },
    {
        email: 'b@c.d',
        password: '123',
        accessLevel: 2
    }
]

module.exports = {
    findByEmail : (email) =>  new Promise((resolve, reject) => {
        resolve(validUsers.find(e => e.email === email))
    })
}