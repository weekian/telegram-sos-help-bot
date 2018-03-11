'use strict'
const events = require('events')


//create an object of EventEmitter class by using above reference
const em = new events.EventEmitter()

module.exports = {
    getEmitter: () => em
}