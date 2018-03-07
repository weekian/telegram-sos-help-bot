'use strict'
const router = require('express').Router()
const { celebrate, Joi, errors } = require('celebrate')
const { authenticate } = require('../../controllers')
const {name: cookieName, options: cookieOpts} = require('../../../utility/cookie')
const log = require('../../../utility/logger')

router.post('/', celebrate({
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}),
(req, res) => {
    authenticate(req.body.email, req.body.password).then(token => {
        if (token !== null) {
            res.cookie(cookieName, token, cookieOpts)
                .status(200)
                .json({
                    redirect: '/home.html'
                })
        } else {
            res.status(401).json({
                message: 'Invalild email/password entered'
            })
        }
    }).catch(err => {
        log(err)
        res.status(500).json({
            message: 'Something went wrong'
        })
    })
})

router.use(errors())

module.exports = router
