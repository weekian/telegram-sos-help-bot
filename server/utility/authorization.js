const jwt = require('express-jwt')
const cookieName = require('./cookie').name

module.exports = {
    jwt: jwt({
        secret: process.env.JWT_TOKEN,
        getToken: function(req) {
            return req && req.signedCookies ? req.signedCookies[cookieName] : null
        }
    }),
    errorHandling: function(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).json({message: 'Unauthorized access'})
        } else {
            next()
        }
    }
}