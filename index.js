'use strict'
const express = require('express')
const app = express()
const restEndpoints = require('./server/web/rest')

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/api', restEndpoints)

app.listen(process.env.PORT, () => console.log("app listening to " + process.env.PORT))