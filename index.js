'use strict'
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const log = require('./src/utility/logger')
const bot = require('./src/bot/telegram')

// Requiring defined Socket routes
const socketRoutes = require('./src/web/routes/socket')

// Requiring defined REST routes
const webPublicRoutes = require('./src/web/routes/rest/publicRoutes')

// Setting up express
const app = express()

// Setting up Server
const server = require('http').createServer(app)

// Setting up socket 
const io = require('socket.io')(server)

// Setting up middlewares
app.use(helmet())
app.use(morgan('combined'))
app.use(cookieParser(process.env.COOKIE_TOKEN))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static('public/build'))

// Registering REST routes
app.use('/api', webPublicRoutes)

// Listening to specified port
server.listen(process.env.PORT || 8080, () => log('app listening to ' + process.env.PORT || 8080))

// Initialization of bot
bot.initialize(app)

// Registering socket routes
socketRoutes.initialize(io)
