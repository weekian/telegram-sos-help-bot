'use strict'
const router = require('express').Router()
const passport = require('../../utility/auth')

const jwt = require('jsonwebtoken')

router.post('/', (req, res) => {
    passport.authenticate('local', (err, user) => {
        if (!user) {
            return res.status(401).json({message: 'Invalid email/password'})
        } else {
            // TODO: Replace with Cookie
            return res.status(200).json(
                {   
                    token: jwt.sign({email: user.email, role: user.role}, 'secret', { expiresIn: '1h' })
                }
            )
        }
    })(req, res)
})

module.exports = router