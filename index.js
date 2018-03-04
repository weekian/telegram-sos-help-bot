'use strict'
const express = require('express')
const app = express()
const morgan = require('morgan')

// Middlewares
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

// Routes
const unprotectedRestEndpoints = require('./server/web/rest/unprotected/routes')
const protectedRestEndpoints = require('./server/web/rest/protected/routes')

// Setting configuration middlewares
app.use(helmet())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.COOKIE_TOKEN))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Setting routes middlewares
app.use('/api', unprotectedRestEndpoints)
app.use('/api', protectedRestEndpoints)

// Listening to predetermined port number
app.listen(process.env.PORT, () => console.log('app listening to ' + process.env.PORT))