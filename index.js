'use strict'
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const log = require('./src/utility/logger')

// Requiring defined routes
const publicWebRoutes = require('./src/web/rest/public/routes')

// Setting up express server
const app = express()

// Setting up middlewares
app.use(helmet())
app.use(morgan('combined'))
app.use(cookieParser(process.env.COOKIE_TOKEN))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Registering routes
app.use('/api', publicWebRoutes)

// Listening to specified port
app.listen(process.env.PORT, () => log('app listening to ' + process.env.PORT))