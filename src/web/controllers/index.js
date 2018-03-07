'use strict'
const { retrieveUser } = require('../services/users')
const { verifyPassword } = require('../../utility/bcrypt')
const { generateToken } = require('../../utility/jwt')

// TODO: Test if errors are propagated w/out try and catch
async function authenticate(email, password) {
    try {
        const user = await retrieveUser(email)
        if (user !== null) {
            const isValidPassword = await verifyPassword(user.password, password)
            if (isValidPassword) {
                return await generateToken({
                    email: user.email
                })
            }
        }
        return null
    } catch (error) {
        throw error
    }
}

module.exports = {
    authenticate
}