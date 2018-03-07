'use strict'
const { sign } =  require('jsonwebtoken')

module.exports = {
    generateToken:(userDetails) => sign(userDetails, process.env.JWT_TOKEN)
}