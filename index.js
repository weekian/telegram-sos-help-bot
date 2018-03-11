'use strict'
const express = require('express')
// const morgan = require('morgan')
// const helmet = require('helmet')
// const cookieParser = require('cookie-parser')
// const log = require('./src/utility/logger')
// const bot = require('./src/bot/telegram')

// Requiring defined routes
// const webPublicRoutes = require('./src/web/routes/rest/publicRoutes')

// Setting up express server
const app = express()

// Setting up middlewares
// app.use(helmet())
// app.use(morgan('combined'))
// app.use(cookieParser(process.env.COOKIE_TOKEN))
// app.use(express.json())
// app.use(express.urlencoded({
//     extended: true
// }))

// app.use(express.static('public/build'))
app.get('/', (req, res) => {
    res.send('HELLO')
})
// Registering routes
// app.use('/api', webPublicRoutes)

// Listening to specified port
app.listen(process.env.PORT || 8080, () => console.log('app listening to ' + process.env.PORT || 8080))

// bot.initialize(app)