'use strict'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Promise = require('bluebird')

const validUsers = [
    {
        email: 'a@b.c',
        password: bcrypt.hashSync('123', 10),
        role: ['L1']
    },
    {
        email: 'b@c.d',
        password: bcrypt.hashSync('123', 10),
        role: ['L1', 'L2']
    }
]

module.exports = {
    authenticate: (email, password) => new Promise(function(resolve, reject) {
        if (email && password) {
            const user = validUsers.find(e => e.email === email)
            if (user) {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        resolve(jwt.sign({email: user.email, role: user.role}, process.env.JWT_TOKEN, { expiresIn: '1h' }))
                    } else {
                        resolve(null)
                    }
                })
            } else {
                resolve(null)
            }
        } else {
            reject({
                status: 400,
                message: 'Incomplete login credentials'
            })
        }
    })  
}