'use strict'
const router = require('express').Router()
const authorization = require('../../../utility/authorization')

router.use(authorization.jwt)
router.use(authorization.errorHandling)

router.post('/test', function(req, res){
    res.status(200).end()
})

module.exports = router