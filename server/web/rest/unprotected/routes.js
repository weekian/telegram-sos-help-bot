'use strict'
const router = require('express').Router()
const auth = require('../../../utility/authentication')
const cookie = require('../../../utility/cookie')

router.post('/', (req, res) => {
    auth.authenticate(req.body.email, req.body.password)
        .then(token => {
            if (token !== null) {
                res.cookie(cookie.name, token, cookie.options)
                    .status(200)
                    .json({
                        redirect:'/home.html'
                    })
            } else{
                res.status(401)
                    .json({message: 'Invalid email/password'})
            }
        })
        .catch(err => {
            res.status(err.status).json({message: err.message})
        })
})

module.exports = router